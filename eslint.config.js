import pluginReact from 'eslint-plugin-react';
import js from '@eslint/js';
import pluginImport from 'eslint-plugin-import';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  js.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],

    plugins: {
      import: pluginImport,
    },

    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        route: 'readonly',
      },
    },

    settings: {
      react:{
        version: "detect",
      },
      'import/resolver': {
        alias: {
          map: [
            ['@', './resources/js']
          ],
          extensions: ['.js', '.jsx', '.ts', '.tsx']
        }
      },
    },
    rules: {
      'semi': ['warn', 'always'],
      'react/require-default-props': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-max-props-per-line': ['error', { maximum: { single: 5, multi: 1 } }],
      'react/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],
      'import/extensions': [
        'warn',
        'never',
      ],
    },
  },
];
