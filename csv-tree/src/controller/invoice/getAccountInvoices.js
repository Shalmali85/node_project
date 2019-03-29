/* eslint-disable no-param-reassign */
const Aria = require('../services/aria.js');
const getBillingData = require('../shared/getBillingData');

function getAccountInvoices(config, args) {
  const aria = new Aria();
  const accountId = args.accountId.trim();
  const token = args.token;
  return aria.getAllInvoices(accountId, token)
    .then((invoices) => {
      if (invoices && invoices.allInvoices) {
        const data = getBillingData(invoices.allInvoices);
        return data;
      }
      return [];
    });
}

module.exports = getAccountInvoices;
