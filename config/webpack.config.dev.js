module.exports = {
  ...require('./webpack.config.main.js'),
  mode: 'development',
  devtool: 'eval-source-map',
  entry: ['./main', './dev']
};
