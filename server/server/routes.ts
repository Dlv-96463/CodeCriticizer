import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { codeAnalysisRequestSchema, type CodeAnalysisResponse, type AnalysisIssue } from "@shared/schema";
import { randomUUID } from "crypto";
import { setupAuth, isAuthenticated } from "./replitAuth";

async function analyzeCodeWithGroq(code: string, language?: string): Promise<AnalysisIssue[]> {
  const groqApiKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;
  
  if (!groqApiKey) {
    throw new Error("GROQ_API_KEY environment variable is required");
  }

  const prompt = `You are an expert code reviewer. Analyze the following ${language} code and identify errors, improvements, security issues, and style suggestions. Return a JSON array of issues with the following structure:

{
  "id": "unique_id",
  "type": "error|improvement|warning|security|style|documentation",
  "severity": "critical|high|medium|low",
  "title": "Brief title",
  "description": "Detailed description",
  "line": number,
  "column": number (optional),
  "endLine": number (optional),
  "endColumn": number (optional),
  "suggestion": "How to fix it (optional)",
  "category": "Performance|Security|Style|Documentation|Logic|Memory"
}

Code to analyze:
\`\`\`${language}
${code}
\`\`\`

Focus on:
1. Errors that would cause runtime issues (type: "error")
2. Performance improvements (type: "improvement") 
3. Security vulnerabilities (type: "security")
4. Code style and best practices (type: "style")
5. Missing documentation (type: "documentation")

Return only valid JSON array, no other text.`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "llama3-8b-8192",
        temperature: 0.1,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No response from Groq API");
    }

    // Parse the JSON response
    let issues: AnalysisIssue[];
    try {
      issues = JSON.parse(content);
    } catch (parseError) {
      // If JSON parsing fails, try to extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        issues = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse AI response as JSON");
      }
    }

    // Ensure each issue has a unique ID
    return issues.map((issue, index) => ({
      ...issue,
      id: issue.id || `issue_${index}_${randomUUID().slice(0, 8)}`,
    }));

  } catch (error) {
    console.error("Error calling Groq API:", error);
    throw new Error(`Failed to analyze code: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Get user's analyses
  app.get('/api/analyses', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const analyses = await storage.getAllAnalyses(userId);
      res.json(analyses);
    } catch (error) {
      console.error("Error fetching analyses:", error);
      res.status(500).json({ message: "Failed to fetch analyses" });
    }
  });

  // Analyze code endpoint
  app.post("/api/analyze", async (req: any, res) => {
    try {
      const validatedData = codeAnalysisRequestSchema.parse(req.body);
      const { code, language, filename } = validatedData;

      const startTime = Date.now();
      const issues = await analyzeCodeWithGroq(code, language || 'javascript');
      const analysisTime = Date.now() - startTime;

      const analysis: CodeAnalysisResponse = {
        id: randomUUID(),
        code,
        language: language || 'javascript',
        issues,
        analysisTime,
        timestamp: new Date().toISOString(),
      };

      // Save with user ID if authenticated
      const userId = req.isAuthenticated() ? req.user?.claims?.sub : undefined;
      await storage.saveAnalysis(analysis, userId);

      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing code:", error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Get analysis by ID
  app.get("/api/analysis/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const analysis = await storage.getAnalysis(id);

      if (!analysis) {
        return res.status(404).json({ error: "Analysis not found" });
      }

      res.json(analysis);
    } catch (error) {
      console.error("Error retrieving analysis:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
