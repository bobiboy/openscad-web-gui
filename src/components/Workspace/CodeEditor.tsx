import { Alert, AlertTitle, SelectChangeEvent } from '@mui/material';
import Editor, { OnMount } from '@monaco-editor/react';
import type * as monaco from 'monaco-editor';
import React, { useEffect, useRef } from 'react';

import {
  openscadLanguageConfig,
  openscadTokensProvider,
} from '../../lib/monaco/openscad-language';
import { setupMonacoEnvironment } from '../../lib/monaco/monaco-setup';
import { validateOpenSCAD } from '../../lib/monaco/openscad-validation';
import { useFileSystemProvider } from '../providers/FileSystemProvider';
import { useWorkspaceProvider } from '../providers/WorkspaceProvider';
import FileSelector from './FileSystem/FileSelector';

interface CodeEditorProps {
  disabled?: boolean;
}

export default function CodeEditor({ disabled }: CodeEditorProps) {
  const { code, setCode, selectedFile, setSelectedFile } =
    useWorkspaceProvider();
  const { files } = useFileSystemProvider();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof monaco | null>(null);

  // Setup Monaco environment once
  useEffect(() => {
    setupMonacoEnvironment();
  }, []);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Register OpenSCAD language
    monaco.languages.register({ id: 'openscad' });

    // Set the language configuration
    monaco.languages.setLanguageConfiguration(
      'openscad',
      openscadLanguageConfig
    );

    // Set the tokens provider for syntax highlighting
    monaco.languages.setMonarchTokensProvider(
      'openscad',
      openscadTokensProvider
    );

    // Set the theme for better OpenSCAD visibility
    monaco.editor.defineTheme('openscad-theme', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '0000FF', fontStyle: 'bold' },
        { token: 'type.identifier', foreground: '267f99' },
        { token: 'variable.predefined', foreground: '800080' },
        { token: 'comment', foreground: '008000' },
        { token: 'string', foreground: 'A31515' },
        { token: 'number', foreground: '098658' },
      ],
      colors: {},
    });

    monaco.editor.setTheme('openscad-theme');

    // Setup validation
    const model = editor.getModel();
    if (model) {
      // Validate on initial load
      const markers = validateOpenSCAD(model);
      monaco.editor.setModelMarkers(model, 'openscad', markers);

      // Validate on content change
      model.onDidChangeContent(() => {
        const markers = validateOpenSCAD(model);
        monaco.editor.setModelMarkers(model, 'openscad', markers);
      });
    }
  };

  const handleCodeChange = (value: string | undefined) => {
    setCode(value || '');
  };

  // Load the selected file.
  const handleFileSelect = (event: SelectChangeEvent<string>) => {
    const file = files.find((f) => f.path === event.target.value);

    if (file) {
      (async () => {
        setCode(await file.text());
        setSelectedFile(file.path);
      })();
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexFlow: 'column' }}>
      <Alert severity="info" sx={{ mb: 1 }}>
        <AlertTitle>Code Editor</AlertTitle>
        Edit the code to your liking.
      </Alert>
      <FileSelector onChange={handleFileSelect} selectedFile={selectedFile} />
      <div style={{ flexGrow: 1, minHeight: 0 }}>
        <Editor
          height="100%"
          language="openscad"
          value={code}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          options={{
            readOnly: disabled,
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            fontSize: 14,
            lineNumbers: 'on',
            renderWhitespace: 'selection',
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            folding: true,
            bracketPairColorization: {
              enabled: true,
            },
          }}
        />
      </div>
    </div>
  );
}
