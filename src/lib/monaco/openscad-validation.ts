import * as monaco from 'monaco-editor';

/**
 * Basic OpenSCAD validation
 * Checks for common syntax errors and issues
 */
export function validateOpenSCAD(
  model: monaco.editor.ITextModel
): monaco.editor.IMarkerData[] {
  const markers: monaco.editor.IMarkerData[] = [];
  const text = model.getValue();
  const lines = text.split('\n');

  lines.forEach((line, lineIndex) => {
    const lineNumber = lineIndex + 1;

    // Check for unmatched braces
    const openBraces = (line.match(/\{/g) || []).length;
    const closeBraces = (line.match(/\}/g) || []).length;
    
    // Check for missing semicolons (basic check - after statements but not in comments)
    if (!line.trim().startsWith('//') && !line.trim().startsWith('/*')) {
      // Check if line looks like a statement that should end with semicolon
      const trimmed = line.trim();
      if (
        trimmed.length > 0 &&
        !trimmed.endsWith(';') &&
        !trimmed.endsWith('{') &&
        !trimmed.endsWith('}') &&
        !trimmed.startsWith('module') &&
        !trimmed.startsWith('function') &&
        !trimmed.startsWith('if') &&
        !trimmed.startsWith('else') &&
        !trimmed.startsWith('for') &&
        !trimmed.match(/^\s*\/\//) &&
        !trimmed.match(/^\s*\/\*/) &&
        !trimmed.match(/\*\/\s*$/)
      ) {
        // Could be a statement - check if it looks like an assignment or function call
        if (trimmed.match(/^[a-zA-Z_$][\w$]*\s*=/) || 
            trimmed.match(/^[a-zA-Z_$][\w$]*\s*\(/)) {
          markers.push({
            severity: monaco.MarkerSeverity.Warning,
            startLineNumber: lineNumber,
            startColumn: line.length,
            endLineNumber: lineNumber,
            endColumn: line.length + 1,
            message: 'Missing semicolon',
          });
        }
      }
    }

    // Check for undefined variables (basic check for $-variables)
    const dollarVarMatch = line.match(/\$[a-zA-Z_]\w*/g);
    if (dollarVarMatch) {
      const validSpecialVars = [
        '$fn', '$fa', '$fs', '$t', '$vpt', '$vpr', '$vpd', '$vpf', 
        '$children', '$preview'
      ];
      
      dollarVarMatch.forEach((varName) => {
        if (!validSpecialVars.includes(varName)) {
          const column = line.indexOf(varName) + 1;
          markers.push({
            severity: monaco.MarkerSeverity.Warning,
            startLineNumber: lineNumber,
            startColumn: column,
            endLineNumber: lineNumber,
            endColumn: column + varName.length,
            message: `Unknown special variable '${varName}'`,
          });
        }
      });
    }
  });

  // Check for unmatched braces in entire document
  const allOpenBraces = (text.match(/\{/g) || []).length;
  const allCloseBraces = (text.match(/\}/g) || []).length;
  
  if (allOpenBraces !== allCloseBraces) {
    markers.push({
      severity: monaco.MarkerSeverity.Error,
      startLineNumber: 1,
      startColumn: 1,
      endLineNumber: 1,
      endColumn: 1,
      message: `Unmatched braces: ${allOpenBraces} opening, ${allCloseBraces} closing`,
    });
  }

  // Check for unmatched parentheses
  const allOpenParens = (text.match(/\(/g) || []).length;
  const allCloseParens = (text.match(/\)/g) || []).length;
  
  if (allOpenParens !== allCloseParens) {
    markers.push({
      severity: monaco.MarkerSeverity.Error,
      startLineNumber: 1,
      startColumn: 1,
      endLineNumber: 1,
      endColumn: 1,
      message: `Unmatched parentheses: ${allOpenParens} opening, ${allCloseParens} closing`,
    });
  }

  // Check for unmatched brackets
  const allOpenBrackets = (text.match(/\[/g) || []).length;
  const allCloseBrackets = (text.match(/\]/g) || []).length;
  
  if (allOpenBrackets !== allCloseBrackets) {
    markers.push({
      severity: monaco.MarkerSeverity.Error,
      startLineNumber: 1,
      startColumn: 1,
      endLineNumber: 1,
      endColumn: 1,
      message: `Unmatched brackets: ${allOpenBrackets} opening, ${allCloseBrackets} closing`,
    });
  }

  return markers;
}
