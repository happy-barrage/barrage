'use strict';
var domain = require('domain');
var express = require('express');
var path = require('path');

//express中间件
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var xmlBodyParser = require('./libs/xmlBodyParser');
var compression = require('compression');

var auth = require('./routes/auth');
var binds = require('./routes/binds');
var wechat = require('./routes/wechat');
var themes = require('./routes/themes');
var chat = require('./routes/chat');

var cloud = require('./cloud');
var config = require('./config');

var app = express();

// 设置 view 引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// 加载云代码方法
app.use(cloud);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(xmlBodyParser);
app.use(compression());

// 未处理异常捕获 middleware
app.use((req, res, next) => {
  let domm = domain.create();
  domm.add(req);
  domm.add(res);
  domm.on('error', function (err) {
    console.error('uncaughtException url=%s, msg=%s', req.url, err.stack || err.message || err);
    if (!res.finished) {
      res.statusCode = 500;
      res.setHeader('content-type', 'application/json; charset=UTF-8');
      res.end('uncaughtException');
    }
  });
  domm.run(next);
});




// 跨域支持
app.all('/api/*', (req, res, next) => {
  const origin = req.headers.origin;
  if (config.whiteOrigins.indexOf(origin) !== -1) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, DELETE');
  }
  next();
});


app.use('/chat', chat);

// api
app.use('/api/auth', auth);
app.use('/api/binds', binds);
app.use('/api/wechat', wechat);
app.use('/api/themes', themes);

var assets_config = require('../client/webpack-assets.json');
var APP_ID = process.env.LC_APP_ID;
var APP_KEY = process.env.LC_APP_KEY;
var _ = require('lodash');
//index
app.get('/', function (req, res) {

  res.render('index', _.assign(assets_config, {
    APP_ID : APP_ID,
    APP_KEY : APP_KEY
  }));

});



 //如果任何路由都没匹配到，则认为 404
 //生成一个异常让后面的 err handler 捕获
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// 如果是开发环境，则将异常堆栈输出到页面，方便开发调试
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    let statusCode = err.status || 500;

    if (statusCode !== 404) {
      //如果不是404错误那么就用json 返回，一般来说就是api模式的
      console.error(err.stack || err);

      res.status(statusCode);
      res.json(err);
      return;
    }

    next();
  });
}

// 如果是非开发环境，则页面只输出简单的错误信息
app.use((err, req, res, next) => {

  let statusCode = err.status || 500;

  if (statusCode !== 404) {
    res.status(statusCode);
    res.json(err);
    return;
  }

  next();
});

app.use((req, res, next) => {

  //res.redirect('/');
  res.render('index', _.assign(assets_config, {
    APP_ID : APP_ID,
    APP_KEY : APP_KEY
  }));
  // res.status(404);
});

module.exports = app;
