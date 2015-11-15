var path = require('path');
var webpack = require('webpack');
var _ = require('lodash');
var PACKAGE_JSON = require('./package.json');
var AssetsPlugin = require('assets-webpack-plugin');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: {
    app : './src/index',
    vendor : _.keys(PACKAGE_JSON.dependencies)
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.[chunkhash].js',
    publicPath: '/dist/'
  },
  devtool : 'hidden-sourcemap',
  plugins: [
    new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor.bundle.js"),
    new webpack.ProvidePlugin({
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch',
      '$': 'jquery',
      'jQuery': 'jquery'
    }),
    new webpack.DefinePlugin({
      '__ENV__': JSON.stringify('production')
    }),
    //from react-starter
    new webpack.PrefetchPlugin("react"),
    new webpack.PrefetchPlugin("react/lib/ReactComponentBrowserEnvironment"),

    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin(true),
    new webpack.NoErrorsPlugin(),
    new AssetsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel?stage=0'],//if use babel promise feature etc..?optional[]=runtime
        exclude: /node_modules/,
        include: __dirname,
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'autoprefixer-loader?browsers=last 2 version', 'sass']
      },
      {
        test: /\.less$/,
        loaders: ['style', 'css', 'autoprefixer-loader?browsers=last 2 version', 'less']
      },
      { test: /\.(png|jpg|jpeg|gif|svg)$/, loader: 'url-loader?limit=10000' },
      { test: /\.(woff|woff2)$/, loader: 'url-loader?limit=100000' }
    ]
  }
}