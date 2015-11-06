'use strict';
var router = require('express').Router();
var AV = require('leanengine');


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
        message : '未认证用户请重新登录'
      };
      next(err);
    }

  } else {
    next();
  }

});


const Bind = AV.Object.extend('Bind');


router.post('/', (req, res, next) => {
  var bind = new Bind();

  bind.set('name', req.body.name);
  bind.set('appId', req.body.appId);
  bind.set('appSecret', req.body.appSecret);
  bind.set('token', req.body.token);
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

  var query = new AV.Query(Bind);

  let {name, token, appId, appSecret} = req.body;

  query.get(req.params.id).try((bind) => {

    bind.set('name', name);
    bind.set('appId', appId);
    bind.set('appSecret', appSecret);
    bind.set('token', token);
    return bind.save();

  }).try((bind) => {
    res.json(bind);
  }).catch((error) => {
    next(error);
  });

});


router.delete('/:id', (req, res, next) => {
  var query = new AV.Query(Bind);
  query.get(req.params.id).try((bind) => {
    return bind.destroy();
  }).try((bind) => {
    res.json(bind);
  }).catch((error) => {
    next(error);
  });
});


router.get('/', (req, res, next) => {
  var query = new AV.Query(Bind);
  query.equalTo('user', req.current);
  query.find().try((binds) => {
    res.json(binds);
  }).catch((error) => {
    next(error);
  });
});

module.exports = router;
