const webpack = require('webpack');
const path = require('path');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: ['./src/_js/main.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(process.cwd(), 'src/_assets/js/')
  },
  plugins: [
    new webpack.DefinePlugin({
      API_URL: "'https://sentry.io/docs/api'"
    }),
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      Popper: 'popper.js'
    })
  ]
};
