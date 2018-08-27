const webpack = require('webpack');
const path = require('path');
const getClientEnvironment = require('./env');
const env = getClientEnvironment();

module.exports = {
  watch: true,
  mode: 'development',
  devtool: 'eval-source-map',
  entry: ['./src/_js/main.js', './src/_js/dev.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(process.cwd(), 'src/_assets/js/')
  },
  plugins: [
    new webpack.DefinePlugin(env.stringified),
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      Popper: 'popper.js'
    })
  ]
};
