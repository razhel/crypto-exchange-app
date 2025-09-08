import node from 'eslint-plugin-node';  // Plugin import

export default [
  {
    languageOptions: {
      globals: {
        node: true,
        es2021: true,
      },
      parserOptions: {
        ecmaVersion: 'latest',
      },
    },
    plugins: {
      node,  // Using the plugin object here
    },
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'warn', // Example rule
      'no-debugger': 'warn',    // Example rule
      // 'node/no-unsupported-features/es-syntax': 'error', // Commenting this out temporarily
      'node/no-missing-import': 'error',
    },
  },
];
