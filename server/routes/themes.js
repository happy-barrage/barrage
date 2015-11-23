'use strict';
var router = require('express').Router();
var AV = require('leanengine');


const Bind = AV.Object.extend('Bind');
const Theme = AV.Object.extend('Theme');


router.get('/bind/:id', (req, res, next) => {
  var bindQuery = new AV.Query(Bind);

  bindQuery.get(req.params.id).try((bind) => {
    var themeQuery = new AV.Query(Theme);

    //type大于或者等于bind的type的，这样可以区分有没头像，或者需不需要回复什么的
    themeQuery.equalTo('type', 0);
    themeQuery.lessThanOrEqualTo('type', parseInt(bind.get('type')));


    return themeQuery.find();

  }).try((themes) => {
    res.json(themes);
  }).catch((error) => {
    next(error);
  });
});



module.exports = router;