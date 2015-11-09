'use strict';
var router = require('express').Router();
var AV = require('leanengine');


var APP_ID = process.env.LC_APP_ID;
var APP_KEY = process.env.LC_APP_KEY;


router.get('/:channel', (req, res, next) => {
  res.render('chat/default/chat', {
    CHANNEL : req.params.channel,
    APP_ID : APP_ID,
    APP_KEY : APP_KEY
  });
});



module.exports = router;