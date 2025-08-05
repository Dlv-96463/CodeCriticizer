import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Header } from '@/components/header';
import { CodeEditor } from '@/components/code-editor';
import { AnalysisResults } from '@/components/analysis-results';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Sparkles } from 'lucide-react';
import type { CodeAnalysisRequest, CodeAnalysisResponse, AnalysisIssue } from '@shared/schema';

export default function Home() {
  const [code, setCode] = useState('// Enter your code here or upload a file\nfunction example() {\n    console.log("Hello, CodeAnalyzer!");\n}');
  const [language, setLanguage] = useState('javascript');
  const [issues, setIssues] = useState<AnalysisIssue[]>([]);
  const [analysisTime, setAnalysisTime] = useState<number | undefined>();
  
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async (data: CodeAnalysisRequest) => {
      const response = await apiRequest('POST', '/api/analyze', data);
      return response.json() as Promise<CodeAnalysisResponse>;
    },
    onSuccess: (data) => {
      setIssues(data.issues);
      setAnalysisTime(data.analysisTime);
      toast({
        title: "Analysis Complete",
        description: `Found ${data.issues.length} issues in ${(data.analysisTime / 1000).toFixed(1)}s`,
      });
    },
    onError: (error: any) => {
      console.error('Analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "An error occurred while analyzing the code",
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = () => {
    if (!code.trim()) {
      toast({
        title: "No Code to Analyze",
        description: "Please enter some code or upload a file first",
        variant: "destructive",
      });
      return;
    }

    analyzeMutation.mutate({
      code: code.trim(),
      language,
    });
  };

  const handleIssueClick = (issue: AnalysisIssue) => {
    // This would scroll to and highlight the specific line in the editor
    // For now, we'll just show a toast with the issue details
    toast({
      title: issue.title,
      description: `Line ${issue.line}: ${issue.description}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 dark:from-gray-950 dark:via-gray-900 dark:to-primary/10 relative">
      {/* Enhanced background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 dots-bg opacity-20" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <Header />
      
      <div className="container mx-auto px-6 py-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-6 py-2 text-sm text-primary mb-6 backdrop-blur-sm">
              <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
              Powered by Advanced AI
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground/70 bg-clip-text text-transparent mb-4 leading-tight">
              AI Code Analysis Studio
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Upload your code or paste it below for instant intelligent analysis with real-time feedback and suggestions
            </p>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 min-h-[calc(100vh-220px)]">
            <div className="xl:col-span-1">
              <CodeEditor
                code={code}
                onCodeChange={setCode}
                language={language}
                onLanguageChange={setLanguage}
                onAnalyze={handleAnalyze}
                isAnalyzing={analyzeMutation.isPending}
                issues={issues}
              />
            </div>
            
            <div className="xl:col-span-2">
              <AnalysisResults
                issues={issues}
                onIssueClick={handleIssueClick}
                analysisTime={analysisTime}
                isAnalyzing={analyzeMutation.isPending}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
