module.exports = {
  root: true,
  env: { 
    browser: true, 
    es2020: true,
    node: true,
    // It seems "jest: true" should be replaced with "vitest/globals: true"
    // or just rely on the setupFiles for vitest.
    // However, the user explicitly asked for 'jest: true'.
    // For now, I will follow the instruction exactly.
    jest: true 
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  // Add globals for Vitest
  globals: {
    describe: 'readonly',
    it: 'readonly',
    expect: 'readonly',
    vi: 'readonly',
    beforeEach: 'readonly',
    afterEach: 'readonly',
  },
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'react/prop-types': 'off',
    // Ignore "React" unused var because we might still have imports in some files
    'no-unused-vars': ['warn', { 'varsIgnorePattern': '^React$' }],
    // Warning for hooks deps instead of error
    'react-hooks/exhaustive-deps': 'warn' 
  },
}