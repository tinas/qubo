import importX from 'eslint-plugin-import-x'
import tseslint from 'typescript-eslint'
import unicorn from 'eslint-plugin-unicorn'
import stylistic from '@stylistic/eslint-plugin'
import vitest from '@vitest/eslint-plugin'

export default tseslint.config(
  {
    files: ['**/*.js', '**/*.ts'],
    extends: [tseslint.configs.base],
    plugins: {
      unicorn,
      'import-x': importX,
      '@stylistic': stylistic,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/comma-dangle': ['error', 'only-multiline'],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/brace-style': ['error', '1tbs'],
      '@stylistic/comma-spacing': ['error', { before: false, after: true }],
      '@stylistic/eol-last': ['error', 'always'],
      '@stylistic/key-spacing': ['error', { beforeColon: false, afterColon: true }],
      '@stylistic/keyword-spacing': ['error', { before: true, after: true }],
      '@stylistic/max-len': ['error', { code: 120 }],
      '@stylistic/no-multiple-empty-lines': ['error', { max: 1 }],
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/space-before-blocks': 'error',
      '@stylistic/space-before-function-paren': ['error', {
        'anonymous': 'always',
        'asyncArrow': 'always',
        'named': 'never',
      }],
      '@stylistic/space-in-parens': ['error', 'never'],
      '@stylistic/space-infix-ops': 'error',
      'unicorn/filename-case': ['error', {
        case: 'kebabCase',
        ignore: ['^[A-Z][a-z]+\\..*'],
      }],
      'unicorn/no-array-callback-reference': 'off',
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }],
    },
    ignores: [
      '**/dist/',
      '**/coverage/',
      '.idea/',
    ],
  },
  {
    files: ['**/__tests__/**'],
    plugins: { vitest },
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },
    rules: {
      'no-console': 'off',
      'no-restricted-globals': 'off',
      'no-restricted-syntax': 'off',
      'vitest/no-disabled-tests': 'error',
      'vitest/no-focused-tests': 'error',
    },
  },
)
