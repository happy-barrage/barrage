'use strict';
var router = require('express').Router();
var AV = require('leanengine');



const Theme = AV.Object.extend('Theme');

// api/themes
// chat/:bid/themes/:theme_name
router.get('/', (req, res, next) => {
  var query = new AV.Query(Theme);
  query.find().try((themes) => {
    res.json(themes);
  }).catch((error) => {
    next(error);
  });
})



module.exports = router;