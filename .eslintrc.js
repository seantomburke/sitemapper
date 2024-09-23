module.exports = {
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
    ecmaFeatures: {},
  },
  env: {
    node: true,
    mocha: true,
    es6: true,
  },
  ignores: [
    'example.js',
    'index.js',
    'lib',
    'node_modules',
    'src/tests',
    'tmp'
  ],
};
