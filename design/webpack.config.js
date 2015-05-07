var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    'app': './js/main.js',
    'styles': './less/main.less',
    'vendor': [
      'jquery',
      'bootstrap'
    ]
  },
  output: {
    path: __dirname + "/../theme/sentry/static",
    //publicPath: "/static/",
    filename: '[name].js'
  },
  devtool: '#source-map',
  resolve: {
    modulesDirectories: ['../node_modules'],
    extensions: ['', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader')
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      },
      {
        test: /\.(woff|eot|ttf|svg)(\?.*)?$/,
        loader: 'url?limit=5000'
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
    new webpack.optimize.DedupePlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new ExtractTextPlugin('sentry.css', {
      allChunks: true
    })
  ],
  externals: {},
  resolve: {
    extensions: ['', '.js']
  }
}
