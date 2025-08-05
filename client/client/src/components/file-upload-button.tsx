import { useState, useRef } from 'react';
import { Upload, File, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { detectLanguageFromFilename } from '@/lib/language-detector';

interface FileUploadButtonProps {
  onFileContent: (content: string, language: string, filename: string) => void;
  isAnalyzing?: boolean;
}

export function FileUploadButton({ onFileContent, isAnalyzing }: FileUploadButtonProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileRead = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const language = detectLanguageFromFilename(file.name);
      
      onFileContent(content, language, file.name);
      setUploadedFile(file.name);
      
      toast({
        title: "File Uploaded Successfully",
        description: `${file.name} (${language}) loaded for analysis`,
      });
    };
    reader.readAsText(file);
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Please select a file smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    const allowedTypes = [
      'text/plain', 'text/javascript', 'text/typescript', 'text/python',
      'text/java', 'text/cpp', 'text/go', 'text/rust', 'text/php',
      'application/javascript', 'application/typescript', 'application/json'
    ];
    
    const fileExtensions = [
      '.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.h',
      '.go', '.rs', '.php', '.rb', '.swift', '.kt', '.cs', '.scala',
      '.html', '.css', '.scss', '.less', '.json', '.xml', '.yaml', '.yml'
    ];
    
    const hasValidExtension = fileExtensions.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    );
    
    if (!allowedTypes.includes(file.type) && !hasValidExtension) {
      toast({
        title: "Unsupported File Type",
        description: "Please select a code file (js, py, java, etc.)",
        variant: "destructive",
      });
      return;
    }

    handleFileRead(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <div
        className={`relative group transition-all duration-300 ${
          isDragOver 
            ? 'scale-105 shadow-lg shadow-primary/25' 
            : 'hover:scale-102 hover:shadow-md hover:shadow-primary/10'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Button
          variant="outline"
          onClick={handleButtonClick}
          disabled={isAnalyzing}
          className={`w-full h-20 border-2 border-dashed transition-all duration-300 group relative overflow-hidden ${
            isDragOver 
              ? 'border-primary bg-primary/10 text-primary shadow-lg shadow-primary/20 scale-105' 
              : 'border-border hover:border-primary/50 hover:bg-primary/5 hover:shadow-md'
          } ${uploadedFile ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 shadow-md' : ''}`}
        >
          <div className="flex items-center justify-center space-x-4 relative z-10">
            {uploadedFile ? (
              <>
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-green-700 dark:text-green-300">
                    {uploadedFile}
                  </div>
                  <div className="text-sm text-green-600/80 dark:text-green-400/80">
                    File loaded successfully
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className={`p-3 rounded-full bg-primary/10 transition-all duration-300 ${
                  isDragOver ? 'bg-primary/20 scale-110' : 'group-hover:bg-primary/15 group-hover:scale-105'
                }`}>
                  <Upload className={`h-6 w-6 text-primary transition-transform duration-300 ${
                    isDragOver ? 'scale-110 rotate-12' : 'group-hover:scale-105'
                  }`} />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg">
                    {isDragOver ? 'Drop your file here' : 'Upload Code File'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Drag & drop or click to browse • Max 5MB
                  </div>
                  <div className="text-xs text-muted-foreground/70 mt-1">
                    Supports JS, TS, Python, Java, C++, Go & more
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Animated background effect */}
          <div className={`absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 opacity-0 transition-opacity duration-300 ${
            isDragOver ? 'opacity-100' : 'group-hover:opacity-50'
          }`} />
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.h,.go,.rs,.php,.rb,.swift,.kt,.cs,.scala,.html,.css,.scss,.less,.json,.xml,.yaml,.yml"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
      </div>
      
      {uploadedFile && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setUploadedFile(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }}
          className="w-full text-xs text-muted-foreground hover:text-destructive"
        >
          Clear uploaded file
        </Button>
      )}
    </div>
  );
}