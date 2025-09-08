module.exports = {
  env: {
    browser: false,
    node: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'no-unused-vars': 'warn',         // Warn if variables are declared but not used
    'no-console': 'off',              // Allow console.log etc.
    'eqeqeq': ['error', 'always'],    // Require === and !==
    'curly': 'error',                 // Require braces for blocks
    'semi': ['error', 'always'],      // Require semicolons
    'quotes': ['error', 'single'],    // Use single quotes
  },
};
