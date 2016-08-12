/* Brocfile.js */

const Funnel = require('broccoli-funnel');
const concat = require('broccoli-concat');
const mergeTrees = require('broccoli-merge-trees');
const esTranspiler = require('broccoli-babel-transpiler');
const pkg = require('./package.json');

const assetsSource = 'src/assets';
const testsSource = 'src/tests';

const es6 = esTranspiler('src', { browserPolyfill: true });

const srcES6 = Funnel(es6, {
  include: ['assets/**/*']
});

const testES6 = Funnel(es6, {
  include: ['tests/**/*']
});

const exampleES6 = Funnel(es6, {
  include: ['examples/**/*']
});

const src = concat(srcES6, {
  inputFiles: './' + assetsSource + '/*.js',
  outputFile: pkg.name + '.js'
});

const test = concat(testES6, {
  inputFiles: './' + testsSource + '/*.js',
  outputFile: '/test.js'
});

module.exports = mergeTrees([src, test, exampleES6]);
