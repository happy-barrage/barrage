'use strict';
var router = require('express').Router();
var AV = require('leanengine');


router.post('/signin', (req, res, next) => {

  AV.User.logIn(req.body.username, req.body.password, {
    success: function (user) {
      // 成功了，现在可以做其他事情了.
      res.cookie('t', user._sessionToken);
      res.json(user);
    },
    error: function (user, error) {
      // 失败了.
      next(error);
    }
  });
});


router.get('/signout', (req, res, next) => {
  AV.User.logOut();
  res.cookie('t', '');
  res.json({
    code : 0,
    message : '退出成功'
  });
});


router.post('/signup', (req, res, next) => {

  var user = new AV.User();

  user.set('username', req.body.username);
  user.set('password', req.body.password);
  user.set('email', req.body.email);

// other fields can be set just like with AV.Object
//  user.set('phone', req.body.phone);

  user.signUp(null, {
    success: function (user) {
      // 注册成功，可以使用了.
      res.cookie('t', user._sessionToken);
      res.json(user);
    },
    error: function (user, error) {
      // 失败了
      next(error);
    }
  });

});

module.exports = router;


