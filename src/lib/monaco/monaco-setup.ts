// Monaco Editor environment configuration
// This ensures Monaco can load its web workers properly

declare global {
  interface Window {
    MonacoEnvironment?: {
      getWorkerUrl: (moduleId: string, label: string) => string;
    };
  }
}

export function setupMonacoEnvironment() {
  // Configure Monaco to use CDN workers for better reliability
  window.MonacoEnvironment = {
    getWorkerUrl: function (moduleId: string, label: string) {
      // Use CDN for Monaco workers to avoid bundling issues
      const monacoVersion = '0.45.0'; // Can be updated as needed
      const baseUrl = `https://cdn.jsdelivr.net/npm/monaco-editor@${monacoVersion}/min/vs`;
      
      if (label === 'json') {
        return `${baseUrl}/language/json/json.worker.js`;
      }
      if (label === 'css' || label === 'scss' || label === 'less') {
        return `${baseUrl}/language/css/css.worker.js`;
      }
      if (label === 'html' || label === 'handlebars' || label === 'razor') {
        return `${baseUrl}/language/html/html.worker.js`;
      }
      if (label === 'typescript' || label === 'javascript') {
        return `${baseUrl}/language/typescript/ts.worker.js`;
      }
      return `${baseUrl}/editor/editor.worker.js`;
    },
  };
}
