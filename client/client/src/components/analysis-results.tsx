import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  CheckCircle, 
  Download, 
  Share, 
  AlertCircle, 
  Lightbulb, 
  Shield, 
  Palette,
  ThumbsUp,
  Bug
} from 'lucide-react';
import type { AnalysisIssue } from '@shared/schema';

interface AnalysisResultsProps {
  issues: AnalysisIssue[];
  isAnalyzing: boolean;
  analysisTime?: number;
  onIssueClick?: (issue: AnalysisIssue) => void;
}

const getIssueIcon = (type: string) => {
  switch (type) {
    case 'error':
      return <Bug className="w-4 h-4" />;
    case 'improvement':
      return <Lightbulb className="w-4 h-4" />;
    case 'security':
      return <Shield className="w-4 h-4" />;
    case 'style':
      return <Palette className="w-4 h-4" />;
    case 'documentation':
      return <ThumbsUp className="w-4 h-4" />;
    default:
      return <AlertCircle className="w-4 h-4" />;
  }
};

const getIssueColor = (type: string) => {
  switch (type) {
    case 'error':
      return 'bg-red-500';
    case 'improvement':
      return 'bg-blue-500';
    case 'security':
      return 'bg-orange-500';
    case 'style':
      return 'bg-blue-500';
    case 'documentation':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'bg-red-100 text-red-800';
    case 'high':
      return 'bg-orange-100 text-orange-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function AnalysisResults({ 
  issues, 
  isAnalyzing, 
  analysisTime, 
  onIssueClick 
}: AnalysisResultsProps) {
  const errorCount = issues.filter(issue => issue.type === 'error').length;
  const improvementCount = issues.filter(issue => issue.type === 'improvement').length;

  const exportReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      analysisTime,
      summary: {
        totalIssues: issues.length,
        errors: errorCount,
        improvements: improvementCount,
      },
      issues,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code-analysis-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border-0 shadow-2xl shadow-primary/10 overflow-hidden">
      <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/20">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-primary" />
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Analysis Results
            </span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            {errorCount > 0 && (
              <Badge className="bg-red-500 text-white">
                {errorCount}
              </Badge>
            )}
            {improvementCount > 0 && (
              <Badge className="bg-blue-500 text-white">
                {improvementCount}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Enhanced Analysis Status */}
        {!isAnalyzing && issues.length > 0 && (
          <div className="p-6 border-b border-primary/10 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                  Analysis Complete
                </span>
                <div className="text-xs text-green-600/80 dark:text-green-400/80">
                  Found {issues.length} insights to improve your code
                </div>
              </div>
              {analysisTime && (
                <div className="text-right">
                  <div className="text-xs font-medium text-green-700 dark:text-green-300">
                    {(analysisTime / 1000).toFixed(1)}s
                  </div>
                  <div className="text-xs text-green-600/60 dark:text-green-400/60">
                    Lightning fast
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {isAnalyzing && (
          <div className="p-6 border-b border-primary/10 bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                <div className="absolute inset-0 w-6 h-6 border border-primary/20 rounded-full animate-pulse"></div>
              </div>
              <div className="flex-1">
                <span className="text-sm font-semibold text-primary">
                  Analyzing your code...
                </span>
                <div className="text-xs text-primary/70">
                  AI is reviewing for errors, improvements & security
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results List */}
        <ScrollArea className="h-[calc(100vh-320px)]">
          {issues.length === 0 && !isAnalyzing ? (
            <div className="p-8 text-center text-gray-500">
              <ThumbsUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No issues found. Great job!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {issues.map((issue) => (
                <div
                  key={issue.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onIssueClick?.(issue)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-6 h-6 ${getIssueColor(issue.type)} rounded-full flex items-center justify-center flex-shrink-0 text-white`}>
                      {getIssueIcon(issue.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">
                          {issue.title}
                        </h4>
                        <span className="text-xs text-gray-500">
                          Line {issue.line}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {issue.description}
                      </p>
                      {issue.suggestion && (
                        <p className="text-sm text-blue-600 mt-1 italic">
                          Suggestion: {issue.suggestion}
                        </p>
                      )}
                      <div className="mt-2 flex items-center space-x-2">
                        <Badge 
                          variant="secondary" 
                          className={getSeverityColor(issue.severity)}
                        >
                          {issue.severity}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {issue.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Action Buttons */}
        {issues.length > 0 && (
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="flex space-x-2">
              <Button 
                onClick={exportReport}
                className="flex-1 bg-primary hover:bg-blue-700"
              >
                <Download className="w-4 h-4 mr-1" />
                Export Report
              </Button>
              <Button variant="outline">
                <Share className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
