import type * as monaco from 'monaco-editor';

// OpenSCAD language configuration for Monaco Editor
export const openscadLanguageConfig: monaco.languages.LanguageConfiguration = {
  comments: {
    lineComment: '//',
    blockComment: ['/*', '*/'],
  },
  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')'],
  ],
  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
  surroundingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
  folding: {
    markers: {
      start: new RegExp('^\\s*//\\s*#?region\\b'),
      end: new RegExp('^\\s*//\\s*#?endregion\\b'),
    },
  },
};

// OpenSCAD syntax highlighting tokens
export const openscadTokensProvider: monaco.languages.IMonarchLanguage = {
  defaultToken: '',
  tokenPostfix: '.scad',

  keywords: [
    'module',
    'function',
    'if',
    'else',
    'for',
    'let',
    'assert',
    'echo',
    'each',
    'true',
    'false',
    'undef',
    'include',
    'use',
  ],

  // 3D primitives and transformations
  builtinFunctions: [
    // 2D primitives
    'circle',
    'square',
    'polygon',
    'text',
    'projection',
    'import',
    
    // 3D primitives
    'sphere',
    'cube',
    'cylinder',
    'polyhedron',
    'multmatrix',
    'linear_extrude',
    'rotate_extrude',
    'surface',
    
    // Transformations
    'translate',
    'rotate',
    'scale',
    'resize',
    'mirror',
    'color',
    'offset',
    'hull',
    'minkowski',
    
    // Boolean operations
    'union',
    'difference',
    'intersection',
    
    // Other operations
    'render',
    'children',
    
    // Mathematical functions
    'abs',
    'acos',
    'asin',
    'atan',
    'atan2',
    'ceil',
    'cos',
    'cross',
    'exp',
    'floor',
    'ln',
    'log',
    'lookup',
    'max',
    'min',
    'norm',
    'pow',
    'rands',
    'round',
    'sign',
    'sin',
    'sqrt',
    'tan',
    
    // String functions
    'chr',
    'concat',
    'len',
    'ord',
    'search',
    'str',
    'version',
    'version_num',
    'parent_module',
    
    // List comprehension
    'is_undef',
    'is_bool',
    'is_num',
    'is_string',
    'is_list',
    'is_function',
  ],

  // Special variables
  specialVariables: [
    '$fn',
    '$fa',
    '$fs',
    '$t',
    '$vpt',
    '$vpr',
    '$vpd',
    '$vpf',
    '$children',
    '$preview',
  ],

  operators: [
    '=',
    '>',
    '<',
    '!',
    '~',
    '?',
    ':',
    '==',
    '<=',
    '>=',
    '!=',
    '&&',
    '||',
    '++',
    '--',
    '+',
    '-',
    '*',
    '/',
    '&',
    '|',
    '^',
    '%',
    '<<',
    '>>',
    '>>>',
    '+=',
    '-=',
    '*=',
    '/=',
    '&=',
    '|=',
    '^=',
    '%=',
    '<<=',
    '>>=',
    '>>>=',
  ],

  // Define symbols
  symbols: /[=><!~?:&|+\-*\/\^%]+/,

  // Escape sequences
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

  tokenizer: {
    root: [
      // Identifiers and keywords
      [
        /[a-z_$][\w$]*/,
        {
          cases: {
            '@keywords': 'keyword',
            '@builtinFunctions': 'type.identifier',
            '@specialVariables': 'variable.predefined',
            '@default': 'identifier',
          },
        },
      ],
      [/[A-Z][\w\$]*/, 'type.identifier'],

      // Whitespace
      { include: '@whitespace' },

      // Delimiters and operators
      [/[{}()\[\]]/, '@brackets'],
      [/[<>](?!@symbols)/, '@brackets'],
      [
        /@symbols/,
        {
          cases: {
            '@operators': 'operator',
            '@default': '',
          },
        },
      ],

      // Numbers
      [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
      [/0[xX][0-9a-fA-F]+/, 'number.hex'],
      [/\d+/, 'number'],

      // Delimiter: after number because of .\d floats
      [/[;,.]/, 'delimiter'],

      // Strings
      [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-terminated string
      [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
    ],

    comment: [
      [/[^\/*]+/, 'comment'],
      [/\/\*/, 'comment', '@push'], // nested comment
      ['\\*/', 'comment', '@pop'],
      [/[\/*]/, 'comment'],
    ],

    string: [
      [/[^\\"]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }],
    ],

    whitespace: [
      [/[ \t\r\n]+/, 'white'],
      [/\/\*/, 'comment', '@comment'],
      [/\/\/.*$/, 'comment'],
    ],
  },
};
