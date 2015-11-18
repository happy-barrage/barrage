var path = require('path');
var webpack = require('webpack');
var _ = require('lodash');

var PACKAGE_JSON = require('./package.json');



var semanticModulesPath = path.resolve(__dirname, 'src/semantic/definitions/modules');

//node modules 路径
var nodeModulesPath = path.resolve(__dirname, 'node_modules');


var config = {

  entry: [
    'webpack-dev-server/client?http://localhost:9000',
    'webpack/hot/only-dev-server',
    './src/index'
  ],
  resolve: {
    alias: {
      'semantic-transition':  semanticModulesPath + '/transition.js',
      'semantic-dropdown': semanticModulesPath + '/dropdown.js',


      //fix react
      'react/lib': path.resolve(nodeModulesPath, 'react/lib'),
      //fix history
      'history/lib': path.resolve(nodeModulesPath, 'history/lib'),


      'react' : nodeModulesPath + '/react/dist/react.min.js',
      'es6-promise' : nodeModulesPath + '/es6-promise/dist/es6-promise.min.js',
      //'history' : nodeModulesPath + '/history/umd/History.min.js', //不知道怎么搞会有污染的代码出现在打包的index里面
      'jquery' : nodeModulesPath + '/jquery/dist/jquery.min.js',
      'react-redux': nodeModulesPath + '/react-redux/dist/react-redux.min.js',
      'react-router': nodeModulesPath + '/react-router/umd/ReactRouter.min.js',
      'redux': nodeModulesPath + '/redux/dist/redux.min.js'
    }
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
    publicPath: '/dist/'
  },

  devtool: 'cheap-module-eval-source-map',

  plugins: [
    new webpack.HotModuleReplacementPlugin(),

    new webpack.DefinePlugin({
      '__ENV__': JSON.stringify('development')
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['react-hot', 'babel?stage=0'],//if use babel promise feature etc..?optional[]=runtime
        exclude: /node_modules|semantic/,
        include: __dirname,
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'autoprefixer?browsers=last 2 version', 'sass']
      },
      {
        test: /\.less$/,
        loaders: ['style', 'css', 'autoprefixer?browsers=last 2 version', 'less']
      },
      { test: /\.(png|jpg|jpeg|gif|svg)$/, loader: 'url-loader?limit=10000' },
      { test: /\.(woff|woff2)$/, loader: 'url-loader?limit=100000' },


      //loader fix
      {test: /ReactRouter(\.min)?\.js$/, loader: 'imports?React=react' },
      {test: /react\-redux(\.min)?\.js$/, loader: 'imports?React=react' },

      //for jquery plugins
      {
        test: /semantic\/definitions\/modules\/(\w+)+.js/,
        loader: "imports?$=jquery,jQuery=jquery"
      },
      //for fetch
      {
        test: /node_modules\/whatwg-fetch\/fetch.js/,
        loader: "imports?this=>global!exports?global.fetch"
      }
    ]
  }
};

var no_parses = [];
var deps = _.keys(PACKAGE_JSON.dependencies);

_.each(deps, function(dep) {
  if(config.resolve.alias[dep]) {
    no_parses.push(config.resolve.alias[dep]);
  }
});

config.module.noParse = no_parses;


module.exports = config;