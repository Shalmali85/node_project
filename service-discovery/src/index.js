const serviceDiscovery = require('./discover-service');
const Cache = require('node-cache');

const cache = new Cache({ stdTTL: 1800, checkperiod: 600, useClones: false });
let opt = {};
function service(options) {
  if (options) {
    opt = options;
  }
}

function createMiddleWare(pins, opt) {
  return (req, res, next) => {
    if (!pins || !(pins instanceof Array)) {
      return next(new Error('options must be an array'), null);
    }
    pins.forEach((pattern) => {
      if (pattern && pattern.pin) {
        const name = pattern.pin.split(':');
        if (name.length !== 2) {
          return next(new Error('Not a valid pattern. Valid formats role:service name or cmd:service name '));
        }
      }
    });
    const cachedvalue = cache.get('services');
    if (cachedvalue) {
      req.clientUrl = cachedvalue;
      return next();
    }

    serviceDiscovery.discover(pins, opt, (err, response) => {
      if (response) {
        console.log(response);
        req.clientUrl = response;
        cache.set('services', response, 1800);
        return next();
      }
      return next(err);
    });
  };
}

service.prototype.find = function (pin) {
  return createMiddleWare(pin, opt);
};

module.exports = createMiddleWare;
module.exports = service;
