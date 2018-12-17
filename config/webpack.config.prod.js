const webpack = require('webpack');
const path = require('path');
const getClientEnvironment = require('./env');
const env = getClientEnvironment();

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: ['./src/_js/main.js'],
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
