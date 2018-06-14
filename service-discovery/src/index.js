const serviceDiscovery = require('./discover-service');
const Cache = require('node-cache');

const cache = new Cache({ stdTTL: 1800, checkperiod: 600, useClones: false });
let opt = {};
function service(options) {
  if (options) {
    opt = options;
  }
}

service.prototype.find = function (pin) {
  return makeMiddleWare(pin, opt);
};
function makeMiddleWare(pins, opt) {
  return (req, res, callback) => {
    if (!pins || !(pins instanceof Array)) {
      return callback(new Error('options must be an array'), null);
    }
    pins.forEach((pattern) => {
      if (pattern && pattern.pin) {
        const name = pattern.pin.split(':');
        if (name.length != 2) {
          return callback(new Error('Not a valid pattern. Valid formats role:service name or cmd:service name '));
        }
      }
    });
    const cachedvalue = cache.get('services');
    if (cachedvalue) {
      req.clientUrl = cachedvalue;
      return callback(null, cachedvalue);
    }

    serviceDiscovery.discover(pins, opt, (err, response) => {
      if (response) {
        console.log(response);
        req.clientUrl = response;
        cache.set('services', response, 1800);
        return callback(null, response);
      }
      return callback(err);
    });
  };
}
module.exports = makeMiddleWare;
module.exports = service;
