export default {
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
};
