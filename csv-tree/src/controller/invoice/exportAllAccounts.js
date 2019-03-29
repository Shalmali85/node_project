const getAccounts = require('./getAccounts');
const exporToCsv = require('../shared/exportToCsv');
const _ = require('lodash');

module.exports = function exportAccounts(config, args, done) {
  getAccounts(config, args, (err, result) => {
    if (result && result.length > 0) {
      const accounts = _.filter(result, account => account.isSuccess);
      const fields = [{ label: 'Account ID', value: 'billingAccountId' }, { label: 'Invoice number', value: 'invoiceNumber' }, { label: 'Due date', value: 'dueDate' }, { label: 'Balance carried forward', value: 'balanceCarriedForward' }, { label: 'New charges', value: 'newCharges' }, { label: 'Amount due', value: 'amountDue' }];
      if (accounts.length > 0) {
        const data = exporToCsv(accounts, fields);
        return done(null, data);
      }
      return done(new Error('No data found to be exported'));
    }
    return done(err);
  });
};

