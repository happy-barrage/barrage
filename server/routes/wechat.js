var router = require('express').Router();
var AV = require('leanengine');
var crypto = require('crypto');
var _ = require('lodash');
var fetchWechat = require('../libs/fetchWechat');
var MP = require('../libs/constant').MP;
var helpers = require('../libs/helpers');
var moment = require('moment');


var Bind = AV.Object.extend('Bind');
var Message = AV.Object.extend('Message');

var UserWechat = AV.Object.extend('UserWechat');

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

  var bindQuery = new AV.Query(Bind);
  var messageQuery = new AV.Query(Message);



  bindQuery.get(req.params.id).try((bind) => {

    //关于access_token 每一种类型的公众号都是可以去获取的

    var accessToken = bind.get('accessToken');
    var expiredAt = bind.get('expiredAt'); //expiredIn+上次获取的时间


    if(!accessToken || (accessToken && parseInt(expiredAt) <= moment().unix())) {
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
    //需要MsgId 重排

    messageQuery.equalTo('msgid', req.body.xml.MsgId[0]);

    return messageQuery.first().try((message) => {
      return AV.Promise.as(message, bind);
    }).catch((error) => {
      return AV.Promise.error(error);
    });


  }).try((message, bind) => {


    if(message) {
      //如果有message那么就不需要重新发送存储
      res.send('');
    }

    //查不到message那么就发送去吧！
    return AV.Promise.as(bind);


  }).try((bind) => {

    //这里区分bind的类型

    var type = bind.get('type');
    var accessToken = bind.get('accessToken');

    var CreateTime = req.body.xml.CreateTime;
    var FromUserName = req.body.xml.FromUserName;
    var MsgType = req.body.xml.MsgType;
    var MsgId = req.body.xml.MsgId;

    var data = {
      time : moment.unix(CreateTime[0]).format('HH:mm:ss'),//second
      type : MsgType[0],
      msgid : MsgId[0]
    };


    if(MP.COMMON === parseInt(type)) {
      //未认证的普通的公众号
      //普通公众号是不能获取用户信息的，所以无法将用户信息传递过去
      return AV.Promise.as(data, accessToken);
    } else {
      //订阅号或者服务号 可以获取头像

      var openid = FromUserName[0];


      //先去查找一下用户有没有在自己的数据库里有，并且看看有没有过期
      var userQuery = new AV.Query(UserWechat);

      userQuery.equalTo('bind', bind);
      userQuery.equalTo('openid', openid);

      return userQuery.first().try((user) => {


        if(user && user.get('expiredAt') >= moment().unix()) {
          //已经存在用户，并且没有过期
          data = _.assign(data, {
            user : user
          });

          return AV.Promise.as(data, accessToken, bind);
        }


        //如果没有用户或者过期
        //如果过期了就需要重新来获取
        return fetchWechat.get('/user/info?access_token=' + accessToken + '&openid=' + openid + '&lang=zh_CN').then((json) => {
          //获取了用户之后需要将用户存储起来，因为获取用户是有限制的，不能每次都去获取用户
          data = _.assign(data, {
            user : json
          });

          //将用户保存起来
          var userWechat = UserWechat.new(_.extend(json, {
            expiredAt : moment().unix() + 604800, //一个星期的过期时间
            bind : bind
          }));
          userWechat.save();

          return AV.Promise.as(data, accessToken, bind);
        });

      });


    }


  }).try((data, accessToken, bind) => {


    //这里返回数据

    var MsgType = req.body.xml.MsgType[0];

    switch (MsgType) {

    case 'text' :
      data = _.assign(data, {
        content : req.body.xml.Content[0]
      });
      break;

    case 'image' :
      //图片的获取需要token和media id，接收了的图片是暂时的图片，需要存储起来，不然3天之后就不见了
      var file = AV.File.withURL(
        'wechat-image.jpg',
        fetchWechat.file('/get?access_token=' + accessToken + '&media_id=' + req.body.xml.MediaId[0]),
        'image/jpeg'
      );
      file.save();
      data = _.assign(data, {
        image : file.url()
      });
      break;
    case 'voice' :
      data = _.assign(data, {
        recognition : req.body.xml.Recognition[0]
      });
      break;
    }


    //将发送过来的数据存储起来，用于MsgId重排
    var message = Message.new(_.extend(data, {
      bind : bind
    }));

    return message.save();



  }).try((message) => {

    var result = message.toJSON();
    result.user = message.get('user');

    AV.Push.send({
      data : result,
      channels : [req.params.id]
    });

    res.send('');

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
