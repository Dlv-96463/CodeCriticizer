import { useRef, useEffect, useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { setupMonaco } from '@/lib/monaco-setup';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUploadButton } from './file-upload-button';
import { Zap, Sparkles, Code2, Play } from 'lucide-react';
import type { AnalysisIssue } from '@shared/schema';

interface CodeEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
  language: string;
  onLanguageChange: (language: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  issues: AnalysisIssue[];
}

export function CodeEditor({
  code,
  onCodeChange,
  language,
  onLanguageChange,
  onAnalyze,
  isAnalyzing,
  issues,
}: CodeEditorProps) {
  const editorRef = useRef<any>(null);
  const [decorations, setDecorations] = useState<string[]>([]);

  useEffect(() => {
    setupMonaco();
  }, []);

  useEffect(() => {
    if (editorRef.current && issues.length > 0) {
      // Clear existing decorations
      if (decorations.length > 0) {
        editorRef.current.deltaDecorations(decorations, []);
      }

      // Add new decorations for issues
      const newDecorations = issues.map((issue) => ({
        range: {
          startLineNumber: issue.line,
          startColumn: issue.column || 1,
          endLineNumber: issue.endLine || issue.line,
          endColumn: issue.endColumn || 1000,
        },
        options: {
          className: issue.type === 'error' ? 'highlight-error' : 
                    issue.type === 'improvement' ? 'highlight-improvement' : 
                    'highlight-warning',
          hoverMessage: {
            value: `**${issue.title}**\n\n${issue.description}${issue.suggestion ? `\n\n*Suggestion: ${issue.suggestion}*` : ''}`,
            supportHtml: true,
          },
          minimap: {
            color: issue.type === 'error' ? '#F44336' : 
                   issue.type === 'improvement' ? '#2196F3' : '#FF9800',
            position: 1,
          },
        },
      }));

      const newDecorationIds = editorRef.current.deltaDecorations([], newDecorations);
      setDecorations(newDecorationIds);
    }
  }, [issues, decorations]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleFileContent = (content: string, filename: string, detectedLanguage: string) => {
    onCodeChange(content);
    onLanguageChange(detectedLanguage);
  };

  return (
    <Card className="glass-card shadow-2xl shadow-primary/10 overflow-hidden group hover:shadow-primary/20 transition-all duration-500">
      <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-b border-primary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="flex items-center justify-between relative z-10">
          <CardTitle className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/60 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
              <div className="relative bg-background/80 p-2 rounded-lg">
                <Code2 className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div>
              <span className="bg-gradient-to-r from-foreground via-primary to-foreground/70 bg-clip-text text-transparent font-bold">
                Code Studio
              </span>
              <div className="text-xs text-muted-foreground">Intelligent Editor</div>
            </div>
          </CardTitle>
          <div className="flex items-center space-x-3">
            <Select value={language} onValueChange={onLanguageChange}>
              <SelectTrigger className="w-40 bg-background/50 border-primary/20 hover:border-primary/40 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="go">Go</SelectItem>
                <SelectItem value="rust">Rust</SelectItem>
                <SelectItem value="php">PHP</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={onAnalyze} 
              disabled={isAnalyzing || !code.trim()}
              className="btn-glow bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary hover:to-primary/70 shadow-xl shadow-primary/25 px-6 py-3 text-base font-semibold group relative overflow-hidden"
            >
              {isAnalyzing ? (
                <div className="flex items-center">
                  <div className="relative mr-3">
                    <Sparkles className="w-5 h-5 animate-spin" />
                    <div className="absolute inset-0 w-5 h-5 animate-pulse">
                      <Sparkles className="w-5 h-5" />
                    </div>
                  </div>
                  <span>Analyzing Magic...</span>
                </div>
              ) : (
                <div className="flex items-center relative z-10">
                  <Zap className="w-5 h-5 mr-3 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                  <span>Analyze Code</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="p-4 bg-gradient-to-r from-primary/5 to-transparent">
          <FileUploadButton 
            onFileContent={(content, detectedLanguage, filename) => {
              onCodeChange(content);
              onLanguageChange(detectedLanguage);
            }}
            isAnalyzing={isAnalyzing}
          />
        </div>

        <div 
          className="relative bg-gradient-to-br from-background to-muted/20" 
          style={{ height: 'calc(100vh - 320px)' }}
        >
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={(value) => onCodeChange(value || '')}
            onMount={handleEditorDidMount}
            theme="vs-dark"
            options={{
              fontSize: 14,
              fontFamily: '"JetBrains Mono", "Fira Code", Monaco, Consolas, monospace',
              lineNumbers: 'on',
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: 'on',
              tabSize: 2,
              insertSpaces: true,
              renderLineHighlight: 'all',
              cursorBlinking: 'smooth',
              smoothScrolling: true,
              padding: { top: 16 },
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
