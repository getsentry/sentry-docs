/* eslint-env node */
/* eslint import/no-nodejs-modules:0 */

const babelOptions = {
  presets: ['babel-preset-gatsby', '@babel/preset-typescript'],
};

module.exports = require('babel-jest').createTransformer(babelOptions);
