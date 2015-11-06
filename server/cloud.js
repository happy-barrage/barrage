'use strict';

var AV = require('leanengine');


/**
 * 一个简单的云代码方法
 */
/*jslint unparam: true */
AV.Cloud.define('hello', function (request, response) {
  response.success('Hello world!');
});

module.exports = AV.Cloud;
