// @ts-check
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: 8,
    sourceType: "module",
    ecmaFeatures: {},
  },
  env: {
    node: true,
    mocha: true,
    es6: true,
  },
});
