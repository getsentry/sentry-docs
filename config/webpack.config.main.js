const webpack = require('webpack');
const path = require('path');
const getClientEnvironment = require('./env');
const env = getClientEnvironment();

const prefix = 'src/_js/';

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  context: path.join(process.cwd(), prefix),
  entry: ['./main'],
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
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: path.join(process.cwd(), prefix),
        exclude: /(vendor|node_modules)/
      }
    ]
  }
};
