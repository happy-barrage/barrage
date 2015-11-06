var path = require('path');
var webpack = require('webpack');



module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-dev-server/client?http://localhost:9000',
    'webpack/hot/only-dev-server',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
    publicPath: '/dist/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch',
      '$': 'jquery',
      'jQuery': 'jquery'
    }),
    new webpack.DefinePlugin({
      '__ENV__': 'development'
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['react-hot', 'babel?stage=0'],//if use babel promise feature etc..?optional[]=runtime
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
      { test: /\.(woff|woff2)$/, loader: 'url-loader?limit=100000' }    ]
  }
}