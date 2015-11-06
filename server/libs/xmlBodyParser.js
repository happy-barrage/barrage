
var xml2js = require('xml2js');

var xmlBodyParser = function (req, res, next) {
  if (req._body) return next();
  req.body = req.body || {};

  // ignore GET
  if ('GET' == req.method || 'HEAD' == req.method || 'OPTIONS' == req.method) return next();

  // check Content-Type
  if (!req.is('text/xml')) return next();

  // flag as parsed
  req._body = true;

  // parse
  var buf = '';
  req.setEncoding('utf8');
  req.on('data', (chunk) => buf += chunk );
  req.on('end', () => {
    xml2js.parseString(buf, function(err, json) {
      if (err) {
        err.status = 400;
        next(err);
      } else {
        req.body = json;
        next();
      }
    });
  });
};

module.exports = xmlBodyParser;