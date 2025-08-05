import {
  users,
  analyses,
  type User,
  type UpsertUser,
  type Analysis,
  type CodeAnalysisResponse,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Analysis operations
  saveAnalysis(analysis: CodeAnalysisResponse, userId?: string): Promise<void>;
  getAnalysis(id: string): Promise<Analysis | undefined>;
  getAllAnalyses(userId?: string): Promise<Analysis[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Analysis operations
  async saveAnalysis(analysis: CodeAnalysisResponse, userId?: string): Promise<void> {
    await db.insert(analyses).values({
      id: analysis.id,
      userId,
      code: analysis.code,
      language: analysis.language,
      issues: analysis.issues,
      analysisTime: analysis.analysisTime.toString(),
    });
  }

  async getAnalysis(id: string): Promise<Analysis | undefined> {
    const [analysis] = await db.select().from(analyses).where(eq(analyses.id, id));
    return analysis;
  }

  async getAllAnalyses(userId?: string): Promise<Analysis[]> {
    if (userId) {
      return await db.select().from(analyses).where(eq(analyses.userId, userId));
    }
    return await db.select().from(analyses);
  }
}

export const storage = new DatabaseStorage();
