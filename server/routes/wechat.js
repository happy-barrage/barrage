var router = require('express').Router();
var AV = require('leanengine');
var crypto = require('crypto');
var _ = require('lodash');
var fetchWechat = require('../libs/fetchWechat');
var moment = require('moment');


var Bind = AV.Object.extend('Bind');

//var xml2js = require('xml2js');



router.get('/:id', function(req, res, next) {
  var query = new AV.Query(Bind);

  query.get(req.params.id).try((bind) => {

    var token = bind.get('token');

    checkSignature(req.query, token, (err, data) => {
      if(err) return next(err);
      return res.send(data);
    });

  }).catch((error) => {
    next(error);
  });
});

router.post('/:id', function(req, res, next) {
  //微信发送接收

  var query = new AV.Query(Bind);

  query.get(req.params.id).try((bind) => {

    var accessToken = bind.get('accessToken');
    var expiredAt = bind.get('expiredAt'); //expiredIn+上次获取的时间


    if(!accessToken || (accessToken && expiredAt <= moment().unix())) {
      //这里去请求获取微信access_token
      //如果没有access token 或者 如果过期了，这个access_token

      return fetchWechat.get('/token?grant_type=client_credential&appid=' + bind.get('appId') + '&secret=' + bind.get('appSecret')).then((json) => {
        bind.set('accessToken', json.access_token);
        bind.set('expiredAt', json.expires_in + moment().unix());
        return bind.save();
      });

    }

    return AV.Promise.as(bind);

  }).try((bind) => {



    var CreateTime = req.body.xml.CreateTime;
    var FromUserName = req.body.xml.FromUserName;
    var MsgType = req.body.xml.MsgType;
    var MsgId = req.body.xml.MsgId;

    fetchWechat.get('/user/info?access_token=' + bind.get('accessToken') + '&openid=' + FromUserName[0] + '&lang=zh_CN').then((json) => {

      var data = {
        user : json,
        time : moment.unix(CreateTime[0]).format('HH:mm:ss'),//second
        type : MsgType[0],
        id : MsgId[0]
      };


      switch (MsgType[0]) {

      case 'text' :
        data = _.assign(data, {
          content : req.body.xml.Content[0]
        });
        break;
        //暂时不需要图片，因为图片需要重新获取
      //case 'image' :
      //  data = _.assign(data, {
      //    image : req.body.xml.PicUrl[0]
      //  });
      //  break;
      case 'voice' :
        data = _.assign(data, {
          recognition : req.body.xml.Recognition[0]
        });
        break;
      }


      AV.Push.send({
        data : data,
        channels : [req.params.id]
      });


      res.send('');


    });





  }).catch((error) => {

    //发送给微信客户端error
    //var result = {
    //  xml: {
    //    ToUserName: req.body.xml.FromUserName[0],
    //    FromUserName: '' + req.body.xml.ToUserName + '',
    //    CreateTime: new Date().getTime(),
    //    MsgType: 'text',
    //    Content: error.code ? error.message : error.errmsg
    //  }
    //};
    //
    //var builder = new xml2js.Builder();
    //var xml = builder.buildObject(result);
    //console.log('res:', result)
    //res.set('Content-Type', 'text/xml');
    //return res.send(xml);

    next(error);
  });




});

// 验证签名
function checkSignature(query, token, cb) {



  var oriStr = [token, query.timestamp, query.nonce].sort().join('');
  var code = crypto.createHash('sha1').update(oriStr).digest('hex');

  //这里请小心那种带’-‘的token

  if (code == query.signature) {
    cb(null, query.echostr);
  } else {
    var err = {
      code : 401,
      message : 'Unauthorized'
    };
    cb(err);
  }
}



module.exports = router;
