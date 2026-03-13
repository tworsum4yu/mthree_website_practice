import js from '@eslint/js';
import globals from 'globals';

export default [
  // 1) what to ignore
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/coverage/**', '**/*.min.js'],
  },

  // 2) lint js
  {
    files: ['**/*.js'],
    plugins: {
      cypress,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...cypress.environments.globals.globals,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...cypress.configs.recommended.rules,

      // common practical stuff
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',
    },
  },
];
