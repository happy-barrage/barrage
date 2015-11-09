'use strict';

let config = {

  // 服务端 host
  host: 'http://localhost:3000',
  // web 开发环境的 host
  webHost: 'http://localhost:9000',
  // 跨域白名单
  whiteOrigins: [
    'http://localhost:9000',
    'http://localhost:3000',
    // 以下两个是在 LeanCloud 中配置的 host，xxx 替换为自己的域名
    'http://dev.barrage.avosapps.com',
    'http://barrage.avosapps.com'
  ]
};

// 判断环境
switch (process.env.LC_APP_ENV) {
  // 当前环境为线上测试环境
case 'stage':
  config.host = 'http://dev.barrage.avosapps.com';
  config.webHost = 'http://dev.barrage.avosapps.com';
  break;

// 当前环境为线上正式运行的环境
case 'production':
  config.host = 'http://barrage.avosapps.com';
  config.webHost = 'http://barrage.avosapps.com';
  break;
}

module.exports = config;
