var fetch = require('node-fetch');
//var xml2js = require('xml2js');
var AV = require('leanengine');


var server_url = 'https://api.weixin.qq.com/cgi-bin';
var server_file_url = 'http://file.api.weixin.qq.com/cgi-bin/media';


exports.get = function(url) {

  return fetch(server_url + url)
    .then((res) => {
      return res.json();
    }).then((json) => {
      if(json.errcode) {
        //表示请求错误
        console.log('wechat error:', json);
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
}



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

