const getAccountInvoices = require('./getAccountInvoices');
const exportToCsv = require('../shared/exportToCsv');
const _ = require('lodash');
const ServiceError = require('tc-utilities/error/ServiceError');
const moment = require('moment');

function setDataForInvoices(billingAccounts, company) {
  const updatedAccounts = billingAccounts.map((account) => {
    const row = account;
    delete row.isSuccess;
    const newBillingId = `\t${parseInt(row.billingAccountId, 10)}`;
    const newInvoiceNumber = `\t${parseInt(row.invoiceNumber, 10)}`;
    const newIssueDate = `\t${moment.utc(row.invoiceIssueDate).format('DD MMM YY')}`;
    return { ...row,
      companyId: `\t${parseInt(company, 10)}`,
      billingAccountId: newBillingId,
      invoiceNumber: newInvoiceNumber,
      invoiceIssueDate: newIssueDate };
  });
  return updatedAccounts;
}

module.exports = function exportAccounts(config, args) {
  return getAccountInvoices(config, args).then((result) => {
    if (result && result.length > 0) {
      const accounts = _.filter(result, account => account.isSuccess);
      const fields = [{ label: 'Company ID', value: 'companyId' },
        { label: 'Account ID', value: 'billingAccountId' }, {
          label: 'Invoice number',
          value: 'invoiceNumber',
        }, { label: 'Issue date', value: 'invoiceIssueDate' }, {
          label: 'Balance carried forward ($)',
          value: 'balanceCarriedForward',
        }, { label: 'New charges ($)', value: 'newCharges' },
        { label: 'Amount due ($)', value: 'amountDue' }];
      const invoices = setDataForInvoices(accounts, args.company);
      const data = exportToCsv(invoices, fields);
      return data;
    }
    throw new ServiceError('422', 'B422', 'No data found to be exported');
  });
};

