import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginMocha from 'eslint-plugin-mocha';
import globals from 'globals';

export default [
  eslint.configs.recommended,
  prettier,
  {
    plugins: {
      prettier: eslintPluginPrettier,
      mocha: eslintPluginMocha,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.commonjs,
        ...globals.es2021,
        ...globals.mocha,
      },
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'prettier/prettier': 'error',
      ...eslintPluginMocha.configs.recommended.rules,
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
  },
];
