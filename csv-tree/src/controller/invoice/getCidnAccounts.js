const BillingServices = require('../services/billingServices');
const _ = require('lodash');
const getAccountNumbers = require('../shared/getAccountNumbers.js');

const sortColumns = ['name'];
const sortOrders = ['asc'];

function getCidnAccounts(config, args) {
  const company = args.company;
  const token = args.bds_token;
  const accounts = {};
  accounts.cidn = company;
  accounts.billingAccounts = [];
  const billingServices = new BillingServices();
  /* temporary code for vantage customers to be removed */
  /* istanbul ignore if */
  if (process.env.COUCHBASE_CIDN) {
    return getAccountNumbers(config, company)
      .then((accountList) => {
        if (accountList) {
          accounts.cidn = company;
          accounts.billingAccounts = [];
          if (accountList && accountList.billingAccountIds) {
            accountList.billingAccountIds.forEach((account) => {
              accounts.billingAccounts.push({
                name: account,
                value: account,
              });
            });
          }
        }
        const sortedAccounts = _.orderBy(accounts.billingAccounts, sortColumns, sortOrders);
        accounts.billingAccounts = sortedAccounts;
        return accounts;
      });
  }
  return billingServices.getAccountNumbers(company, token)
    .then((accountList) => {
      accounts.cidn = company;
      accounts.billingAccounts = [];
      if (accountList && accountList.customer && accountList.customer.billingAccounts) {
        accountList.customer.billingAccounts.forEach((account) => {
          accounts.billingAccounts.push({
            name: account.billingAccountNumber,
            value: account.billingAccountNumber,
          });
        });
      }
      const sortedAccounts = _.orderBy(accounts.billingAccounts, sortColumns, sortOrders);
      accounts.billingAccounts = sortedAccounts;
      return accounts;
    });
}

module.exports = getCidnAccounts;
