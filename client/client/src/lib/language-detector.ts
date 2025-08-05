// Language detection utility for code analysis
export function detectLanguageFromCode(code: string): string {
  const trimmedCode = code.trim();
  
  // JavaScript/TypeScript patterns
  if (
    /^\s*(import|export|const|let|var|function|class)\s/m.test(trimmedCode) ||
    /\b(console\.log|document\.|window\.)\b/.test(trimmedCode) ||
    /\b(React|useState|useEffect)\b/.test(trimmedCode) ||
    /\.(js|jsx|ts|tsx)$/.test(trimmedCode)
  ) {
    if (/\b(interface|type\s+\w+\s*=|:\s*(string|number|boolean))\b/.test(trimmedCode)) {
      return 'typescript';
    }
    return 'javascript';
  }
  
  // Python patterns
  if (
    /^\s*(def|class|import|from|if __name__)\s/m.test(trimmedCode) ||
    /\b(print\(|len\(|range\()\b/.test(trimmedCode) ||
    /^\s*#.*python/mi.test(trimmedCode) ||
    /\.(py)$/.test(trimmedCode)
  ) {
    return 'python';
  }
  
  // Java patterns
  if (
    /^\s*(public|private|protected|class|interface)\s/m.test(trimmedCode) ||
    /\b(System\.out\.println|public static void main)\b/.test(trimmedCode) ||
    /\.(java)$/.test(trimmedCode)
  ) {
    return 'java';
  }
  
  // C++ patterns
  if (
    /^\s*#include\s*[<"]/m.test(trimmedCode) ||
    /\b(std::|cout|cin|endl)\b/.test(trimmedCode) ||
    /\b(int main\(|void main\()\b/.test(trimmedCode) ||
    /\.(cpp|cc|cxx|c)$/.test(trimmedCode)
  ) {
    return 'cpp';
  }
  
  // Go patterns
  if (
    /^\s*(package|import|func|var|const)\s/m.test(trimmedCode) ||
    /\b(fmt\.Println|make\(|chan\s+\w+)\b/.test(trimmedCode) ||
    /\.(go)$/.test(trimmedCode)
  ) {
    return 'go';
  }
  
  // Default to JavaScript if no clear pattern is found
  return 'javascript';
}

export function detectLanguageFromFilename(filename: string): string {
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  
  const extensionMap: Record<string, string> = {
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
  
  return extensionMap[extension] || 'javascript';
}

export function getLanguageDisplayName(language: string): string {
  const displayNames: Record<string, string> = {
    'javascript': 'JavaScript',
    'typescript': 'TypeScript',
    'python': 'Python',
    'java': 'Java',
    'cpp': 'C++',
    'go': 'Go',
  };
  
  return displayNames[language] || language;
}