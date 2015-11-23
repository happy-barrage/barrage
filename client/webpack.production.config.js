var path = require('path');
var webpack = require('webpack');
var _ = require('lodash');

var AssetsPlugin = require('assets-webpack-plugin');

var PACKAGE_JSON = require('./package.json');


//semantic插件的路径
var semanticModulesPath = path.resolve(__dirname, 'src/semantic/definitions/modules');

var semanticAlias = {
  'semantic-transition':  semanticModulesPath + '/transition.js',
  'semantic-dropdown': semanticModulesPath + '/dropdown.js',
};

//node modules 路径
var nodeModulesPath = path.resolve(__dirname, 'node_modules');

var config = {
  entry: {
    app : './src/index',
    vendor: []
  },


  resolve: {
    alias: {
      //'semantic-transition':  semanticModulesPath + '/transition.js',
      //'semantic-dropdown': semanticModulesPath + '/dropdown.js',


      //fix react
      'react/lib': nodeModulesPath + 'react/lib',
      //fix history
      'history/lib': nodeModulesPath + 'history/lib',

      'react' : nodeModulesPath + '/react/dist/react.min.js',
      'es6-promise' : nodeModulesPath + '/es6-promise/dist/es6-promise.min.js',
      //'history' : nodeModulesPath + '/history/umd/History.min.js',
      'jquery' : nodeModulesPath + '/jquery/dist/jquery.min.js',
      'react-redux': nodeModulesPath + '/react-redux/dist/react-redux.min.js',
      'react-router': nodeModulesPath + '/react-router/umd/ReactRouter.min.js',
      'redux': nodeModulesPath + '/redux/dist/redux.min.js'

      //no lodash,redux-localstorage,redux-thunk,fetch
    }
  },


  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.[chunkhash].js',
    publicPath: '/dist/'
  },
  devtool : 'hidden-sourcemap',//stage模式下不需要sourcemap

  plugins: [
    new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor.bundle.js"),

    new webpack.DefinePlugin({
      '__ENV__': JSON.stringify('production')
    }),
    //from react-starter
    new webpack.PrefetchPlugin("react"),
    new webpack.PrefetchPlugin("jquery"),

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
        //fix [BABEL] Note: The code generator has deoptimised the styling of "/dropdown.js" as it exceeds the max of "100KB
        exclude: /node_modules|semantic/,
        include: path.resolve(__dirname, 'src'),
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
    ],

    noParse : [

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

config.resolve.alias = _.assign(config.resolve.alias, semanticAlias);//加入semantic的插件
config.module.noParse = no_parses;
config.entry.vendor = deps.concat(_.keys(semanticAlias));



module.exports = config;