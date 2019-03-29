const getAccountInvoices = require('./getAccountInvoices');
const exportToCsv = require('../../shared/exportToCsv');
const _ = require('lodash');
const ServiceError = require('tc-utilities/error/ServiceError');
const moment = require('moment');

function setDataForInvoices(billingAccounts) {
  const updatedAccounts = billingAccounts.map((args) => {
    const row = args;
    delete row.isSuccess;
    const newBillingId = `\t${parseInt(row.billingAccountId, 10)}`;
    const newInvoiceNumber = `\t${parseInt(row.invoiceNumber, 10)}`;
    const newDueDate = `\t${moment.utc(row.dueDate).format('DD MMM YY')}`;
    return { ...row,
      billingAccountId: newBillingId,
      invoiceNumber: newInvoiceNumber,
      dueDate: newDueDate };
  });
  return updatedAccounts;
}

module.exports = function exportAccounts(config, args) {
  return getAccountInvoices(config, args).then((result) => {
    if (result && result.length > 0) {
      const accounts = _.filter(result, account => account.isSuccess);
      const fields = [{ label: 'Account ID', value: 'billingAccountId' }, {
        label: 'Invoice number',
        value: 'invoiceNumber',
      }, { label: 'Due date', value: 'dueDate' }, {
        label: 'Balance carried forward ($)',
        value: 'balanceCarriedForward',
      }, { label: 'New charges ($)', value: 'newCharges' },
      { label: 'Amount due ($)', value: 'amountDue' }];
      const invoices = setDataForInvoices(accounts);
      const data = exportToCsv(invoices, fields);
      return data;
    }
    throw new ServiceError('422', 'B422', 'No data found to be exported');
  });
};

