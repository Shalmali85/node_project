const BillingService = require('../services/billingServices.js');
const getBillingData = require('../shared/getBillingData.js');
const Aria = require('../services/aria.js');
const { handleAccountsError } = require('../shared/errorHandler');
const ServiceError = require('tc-utilities/error/ServiceError');
const getAccountNumbers = require('../shared/getAccountNumbers.js');

const aria = new Aria();
const async = require('async');

const billingServices = new BillingService();

/* istanbul ignore next */
function getARIAJsonData(accountId, callback, allAccountsData, message, token) {
  aria.getLatestInvoiceData(accountId, 'json', token)
    .then((invoiceData) => {
      callback(null, allAccountsData.push({ invoiceData }));
    }).catch((error) => {
      const handleAllErrors = handleAccountsError(error, accountId, allAccountsData, message);
      if (handleAllErrors instanceof Array) {
        return callback(null, handleAllErrors);
      }
      return callback(handleAllErrors, null);
    });
}

/* istanbul ignore next */
function getAsyncTasks(asyncTasks, billingIds, allAccountsData, message, token) {
  billingIds.forEach((item) => {
    asyncTasks.push((callback) => {
      getARIAJsonData(item.billingAccountNumber || item, callback, allAccountsData, message, token);
    });
  });
}

/* istanbul ignore next */
async function getAccounts(config, args, done) {
  try {
    const token = args.token;
    let billingIds;
    /* temporary code for vantage customers to be removed */
    if (process.env.COUCHBASE_CIDN) {
      const data = await getAccountNumbers(config, args.company);
      billingIds = data.billingAccountIds;
    } else {
      const accountNumbers = await billingServices.getAccountNumbers(args.company, args.bds_token);
      billingIds = accountNumbers.customer ? accountNumbers.customer.billingAccounts : [];
    }
    if (billingIds.length === 0) {
      const genericError = new ServiceError(422, 'G422', config.billing.errorMessages['No billing accounts available'].message);
      throw genericError;
    }
    const asyncTasks = [];
    const allAccountsData = [];
    getAsyncTasks(asyncTasks, billingIds, allAccountsData, config.billing.errorMessages, token);
    async.parallel(asyncTasks, (callback) => {
      const summaryData = getBillingData(allAccountsData);
      return done(callback, summaryData);
    });
  } catch (error) {
    console.log(error);
    done(error);
  }
}
module.exports = getAccounts;
