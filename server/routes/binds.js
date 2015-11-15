'use strict';
var router = require('express').Router();
var AV = require('leanengine');
var _ = require('lodash');


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




    messages = _.map(messages, (message) => {
      var m = message.toJSON();
      m.user = message.get('user');
      return m;
    });

    res.json(messages);
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
