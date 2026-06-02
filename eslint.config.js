import tseslint from 'typescript-eslint';
import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier'; // 1. Import it

export default [
  { 
    files: ['**/*.{js,mjs,cjs,ts}'] 
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }]
    }
  },
  eslintConfigPrettier // 2. Add it last to override conflicting rules
];
