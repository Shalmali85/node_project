const Aria = require('../services/aria.js');
const moment = require('moment');
const ServiceError = require('tc-utilities/error/ServiceError');


module.exports = function getLatestInvoiceDue(config, args) {
  const accountId = args.accountId.trim();
  const token = args.token;
  const aria = new Aria();
  /* istanbul ignore next */
  return aria.getLatestInvoiceData(accountId, 'json', token)
    .then((invoiceData) => {
      const billingData = {};
      if (invoiceData && invoiceData.invoiceDetails && invoiceData.paymentSummary) {
        billingData.dueDate = invoiceData.paymentSummary.dueDate ? moment(invoiceData.paymentSummary.dueDate, 'DD MMM yy').format('YYYY-MM-DDTHH:mm:ss') : '';
        billingData.totalDue = invoiceData.paymentSummary.totalDue;
        billingData.invoiceNumber = invoiceData.invoiceDetails.invoiceNumber;
        return billingData;
      }
      throw new ServiceError('422', 'G422', 'Missing information');
    });
};
