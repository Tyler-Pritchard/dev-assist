/**
 * Detects the programming language based on the file extension.
 * @param filename - Name of the file to analyze.
 * @returns The detected programming language as a string.
 */
const detectLanguage = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'py':
        return 'python';
      case 'js':
        return 'javascript';
      case 'java':
        return 'java';
      case 'ts':
        return 'typescript';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'json':
        return 'json';
      default:
        return 'plaintext'; // Default to plain text for unknown extensions
    }
  };
  
  export default detectLanguage;
  