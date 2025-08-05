import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudUpload } from 'lucide-react';

interface FileUploadProps {
  onFileContent: (content: string, filename: string, language: string) => void;
}

const languageMap: Record<string, string> = {
  '.js': 'javascript',
  '.jsx': 'javascript',
  '.ts': 'typescript',
  '.tsx': 'typescript',
  '.py': 'python',
  '.java': 'java',
  '.cpp': 'cpp',
  '.cc': 'cpp',
  '.cxx': 'cpp',
  '.c': 'cpp',
  '.go': 'go',
};

export function FileUpload({ onFileContent }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        const content = reader.result as string;
        const extension = file.name.substring(file.name.lastIndexOf('.'));
        const language = languageMap[extension] || 'javascript';
        
        onFileContent(content, file.name, language);
      };
      
      reader.readAsText(file);
    });
  }, [onFileContent]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/*': ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.cc', '.cxx', '.c', '.go'],
    },
    multiple: false,
  });

  return (
    <div className="p-4 border-b border-gray-200 bg-gray-50">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary bg-primary/10'
            : 'border-gray-300 hover:border-primary'
        }`}
      >
        <input {...getInputProps()} />
        <CloudUpload className="mx-auto text-gray-400 w-10 h-10 mb-2" />
        <p className="text-gray-600 mb-1">
          Drop your code files here or{' '}
          <span className="text-primary font-medium">browse</span>
        </p>
        <p className="text-sm text-gray-500">
          Supports .js, .py, .java, .cpp, .ts, .go files
        </p>
      </div>
    </div>
  );
}
