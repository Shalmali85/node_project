/* eslint-disable camelcase,radix */
const NodeCache = require('node-cache');
const BillingServices = require('../controller/services/billingServices');
const { handleBillingError } = require('../controller/shared/errorHandler');
const formatError = require('../controller/shared/formatError');

const cache = new NodeCache({ stdTTL: process.env.BDS_TOKEN_EXPIRY_TIME || 3500,
  checkperiod: 600 });

const ServiceError = require('tc-utilities/error/ServiceError');


async function bdsTokenGenerator(config, req, res, next) {
  const billingServices = new BillingServices();
  try {
    const access_token = cache.get('token');
    if (!req.args) {
      req.args = {};
    }
    if (access_token) {
      req.args.bds_token = access_token;
      return next();
    }
    const token = await (billingServices.generateToken(config));
    cache.set('token', token.access_token, process.env.BDS_TOKEN_EXPIRY_TIME || 3500);
    req.args.bds_token = token.access_token;
    return next();
  } catch (err) {
    console.log(err);
    if (err instanceof ServiceError) { return res.status(400).json({ status: '400', code: '400', message: err.message }, 400); }
    return res.status(parseInt(formatError(handleBillingError(err,
      config.billing.errorMessages)).status))
      .json(formatError(handleBillingError(err, config.billing.errorMessages)),
        parseInt(formatError(handleBillingError(err, config.billing.errorMessages)).status));
  }
}

module.exports = bdsTokenGenerator;
