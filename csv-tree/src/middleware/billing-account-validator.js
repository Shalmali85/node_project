
const BillingServices = require('../controller/services/billingServices');
const _ = require('lodash');
const getAccountNumbers = require('../controller/shared/getAccountNumbers.js');

const billingServices = new BillingServices();

async function billingAccountValidator(config, req, res, next) {
  try {
    /* temporary code for vantage to be removed */
    /* istanbul ignore if */
    if (process.env.COUCHBASE_CIDN) {
      const accountNumbers = await getAccountNumbers(config, req.args.company);
      if (req.params.accountId &&
          !accountNumbers.billingAccountIds.includes(req.params.accountId)) {
        return res.status(400).json({
          status: '400',
          code: 'G400',
          message: 'Requested resource is not valid or cannot be found',
        });
      }
      return next();
    }
    if (req.params.accountId) {
      const accountNumbers = await billingServices.getAccountNumbers(req.args.company,
        req.args.bds_token);
      if (!(_.find(accountNumbers.customer.billingAccounts,
        { billingAccountNumber: req.params.accountId }))) {
        return res.status(400).json({
          status: '400',
          code: 'G400',
          message: 'Requested resource is not valid or cannot be found',
        });
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: '500', code: '500', message: 'Internal Server Error' });
  }
  return next();
}

module.exports = billingAccountValidator;
