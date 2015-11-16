'use strict';
var router = require('express').Router();
var AV = require('leanengine');
var _ = require('lodash');
var moment = require('moment');
var uuid = require('../libs/helpers').uuid;
var fetchWechat = require('../libs/fetchWechat');


router.use((req, res, next) => {

  //拿用户的中间件

  if(req.method !== 'OPTIONS') {
    //pre flight option 不会传递cookie的


    if(req.cookies && req.cookies.t) {

      var token = req.cookies.t;

      AV.User.become(token).then((user) => {
        req.current = user;
        next();
      }).catch((err) => {
        next(err);
      });

    } else {
      var err = {
        code : 401,
        message : '认证已过期，请重新登录'
      };
      next(err);
    }

  } else {
    next();
  }

});


const Bind = AV.Object.extend('Bind');
const Message = AV.Object.extend('Message');

const UserWechat = AV.Object.extend('UserWechat');


router.post('/', (req, res, next) => {
  //创建bind
  var bind = new Bind();

  bind.set('name', req.body.name);
  bind.set('appId', req.body.appId);
  bind.set('appSecret', req.body.appSecret);
  bind.set('token', req.body.token);
  bind.set('type', req.body.type);
  bind.set('user', req.current);
  //bind.setACL(new AV.ACL(req.current));

  bind.save().try((bind) => {
    //success

    res.json(bind);
  }).catch((error) => {
    next(error);
  });

});

router.put('/:id', (req, res, next) => {
  //更新bind

  var query = new AV.Query(Bind);

  query.get(req.params.id).try((bind) => {

    bind.set('name', req.body.name);
    bind.set('appId', req.body.appId);
    bind.set('appSecret', req.body.appSecret);
    bind.set('token', req.body.token);
    bind.set('type', req.body.type);
    return bind.save();

  }).try((bind) => {
    res.json(bind);
  }).catch((error) => {
    next(error);
  });

});


router.delete('/:id', (req, res, next) => {
  //删除
  var query = new AV.Query(Bind);
  query.get(req.params.id).try((bind) => {
    return bind.destroy();
  }).try((bind) => {
    res.json(bind);
  }).catch((error) => {
    next(error);
  });
});

router.get('/:id/messages', (req, res, next) => {

  //获取最近的20条message
  var messageQuery = new AV.Query(Message);
  var bindQuery = new AV.Query(Bind);

  bindQuery.get(req.params.id).try((bind) => {
    messageQuery.equalTo('bind', bind);
    messageQuery.limit(20);
    messageQuery.include('user');
    messageQuery.descending('createdAt');
    return messageQuery.find();
  }).try((messages) => {




    messages = _(messages).map((message) => {
      var m = message.toJSON();
      m.user = message.get('user');
      return m;
    }).reverse();

    res.json(messages);
  }).catch((error) => {
    next(error);
  });

});


router.post('/:id/messages', (req, res, next) => {

  var message = new Message();
  var bindQuery = new AV.Query(Bind);
  var userQuery = new AV.Query(UserWechat);



  //先拿到bind，再看一下user有没有，然后创建message，然后push send message


  bindQuery.get(req.params.id).try((bind) => {


    //先检查一下用户在不在？
    userQuery.equalTo('bind', bind);
    userQuery.equalTo('openid', bind.get('appId'));

    return userQuery.first().try((user) => {
      if(!user) {
        //表示不存在

        var userBind = UserWechat.new({
          nickname: bind.get('name'),
          openid : bind.get('appId'),
          bind: bind,
          headimgurl : '/dist/images/doge.png',
          self : true
        });

        return userBind.save().try((user) => {
          return AV.Promise.as(user, bind);
        }).catch((error) => {
          return AV.Promise.error(error);
        });
      }

      return AV.Promise.as(user, bind);
    });





  }).try((user, bind) => {

    message.set('content', req.body.content);
    message.set('type', req.body.type);

    //这下面的数据都是服务端生成
    message.set('msgid', uuid());
    message.set('time', moment().format('HH:mm:ss'));// todo 这个时间需要改一下，变成秒也好，什么也好

    message.set('bind', bind);
    message.set('user', user); //这里的user可以建造，不需要从request过来

    return message.save().try((message) => {
      return AV.Promise.as(message, bind);
    }).catch((error) => {
      return AV.Promise.error(error);
    });


  }).try((message, bind) => {

    var replies = req.body.replies;

    //需要user也传过去
    var result = message.toJSON();
    result.user = message.get('user');

    AV.Push.send({
      data: result,
      channels : [req.params.id]
    });


    if(!_.isEmpty(replies)) {
      //这里客服回复
      return fetchWechat.accessToken(bind).try((bind) => {
        //这里的bind是最新的，拥有access_token的


        function replyPromise(openid) {
          return new AV.Promise((resolve) => {

            fetchWechat.post('/message/custom/send?access_token=' + bind.get('accessToken'), {
              'touser' : openid,
              'msgtype' : req.body.type,
              'text' : {
                'content' : req.body.content
              }
            }).then((json) => {
              //这个json是空的
              resolve(json);
            });

          });
        }

        var promises = [];

        _.each(replies, (reply) => {
          promises.push(replyPromise(reply.openid));
        });


        return AV.Promise.when(promises);

      }).try(() => {

        return AV.Promise.as(message);

      }).catch((error) => {
        return AV.Promise.error(error);
      });

    }


    return AV.Promise.as(message);

  }).try((message) => {
    //这里表示已经回复成功

    res.json(message);

  }).catch((error) => {
    next(error);
  });

});


router.get('/', (req, res, next) => {
  //获取所有该用户的
  var query = new AV.Query(Bind);
  query.equalTo('user', req.current);
  query.find().try((binds) => {
    res.json(binds);
  }).catch((error) => {
    next(error);
  });
});

module.exports = router;
