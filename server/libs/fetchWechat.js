var fetch = require('node-fetch');
//var xml2js = require('xml2js');
var AV = require('leanengine');
var moment = require('moment');


var server_url = 'https://api.weixin.qq.com/cgi-bin';
var server_file_url = 'http://file.api.weixin.qq.com/cgi-bin/media';


exports.get = function(url) {

  return fetch(server_url + url)
    .then((res) => {
      return res.json();
    }).then((json) => {
      if(json.errcode) {
        //表示请求错误
        console.log('wechat get error:', json);
        return AV.Promise.error({
          code : json.errcode,
          message : json.errmsg
        });
      }
      return json;
    });

};

exports.post = function(url, body) {
  return fetch(server_url + url, {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then((res) => {
    return res.json();
  }).then((json) => {
    if(json.errcode) {
      //表示请求错误
      console.log('wechat post error:', json);
      return AV.Promise.error({
        code : json.errcode,
        message : json.errmsg
      });
    }
    return json;
  });
}

exports.file = function(url) {
  return server_file_url + url;
};

/**
 * 关于更新access_token的事情
 * @param bind
 * @returns Promise
 */
exports.accessToken = function(bind) {
  //关于access_token 每一种类型的公众号都是可以去获取的

  var accessToken = bind.get('accessToken');
  var expiredAt = bind.get('expiredAt'); //expiredIn+上次获取的时间


  if(!accessToken || (accessToken && parseInt(expiredAt) <= moment().unix())) {
    //这里去请求获取微信access_token
    //如果没有access token 或者 如果过期了，这个access_token
    return this.get('/token?grant_type=client_credential&appid=' + bind.get('appId') + '&secret=' + bind.get('appSecret')).then((json) => {
      bind.set('accessToken', json.access_token);
      bind.set('expiredAt', json.expires_in + moment().unix());
      return bind.save();
    });

  }

  return AV.Promise.as(bind);
};



//exports.replyFormat = function({ToUserName, FromUserName, Content}) {
//  //目前貌似没有这个接口，所以只能最多是一个自动回复使用
//  var result = {
//    xml: {
//      ToUserName: ToUserName,
//      FromUserName: FromUserName,
//      CreateTime: new Date().getTime(),
//      MsgType: 'text',
//      Content: Content
//    }
//  };
//
//
//  var builder = new xml2js.Builder();
//  var xml = builder.buildObject(result);
//
//  return xml;
//
//}

