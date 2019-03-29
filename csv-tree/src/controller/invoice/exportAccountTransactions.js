const getAccountTransactions = require('./getAccountTransactions');
const exportToCsv = require('../shared/exportToCsv');
const ServiceError = require('tc-utilities/error/ServiceError');
const moment = require('moment');

function setDataForTransactions(transactions, args) {
  const updatedAccounts = transactions.map((transaction) => {
    const row = transaction;
    const transactionId = `\t${parseInt(row.transactionId, 10)}`;
    const newDateReceived = `\t${moment.utc(row.dateReceived).format('DD MMM YY')}`;
    return {
      ...row,
      companyId: `\t${parseInt(args.company, 10)}`,
      billingAccountId: `\t${parseInt(args.accountId, 10)}`,
      transactionId,
      dateReceived: newDateReceived,
    };
  });
  return updatedAccounts;
}
module.exports = function exportAccountTransaction(args) {
  return getAccountTransactions(args).then((accountTransactions) => {
    if (accountTransactions && accountTransactions.transactions
        && accountTransactions.transactions.length > 0) {
      const fields = [{ label: 'Company ID', value: 'companyId' }, { label: 'Account ID', value: 'billingAccountId' }, { label: 'Telstra transaction ID', value: 'transactionId' }, {
        label: 'Date received',
        value: 'dateReceived',
      }, { label: 'Amount received ($)', value: 'amountReceived' }, {
        label: 'Amount applied to invoices ($)',
        value: 'amountApplied',
      }, { label: 'Amount added as credit ($)', value: 'amountCredited' }];
      const parsedAccountTransactions = setDataForTransactions(accountTransactions.transactions, args);
      const data = exportToCsv(parsedAccountTransactions, fields);
      return data;
    }
    throw new ServiceError('422', 'B422', 'No data found to be exported');
  });
};

