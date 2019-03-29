const Aria = require('../services/aria.js');
const ServiceError = require('tc-utilities/error/ServiceError');

function getInvoice(config, args) {
  const accountId = args.accountId.trim();
  const token = args.token;
  if (!args.invoiceNumber) {
    throw new ServiceError('400', 'B400', 'Invoice Number is mandatory');
  }
  const invoiceNumber = args.invoiceNumber.trim();
  const aria = new Aria();
  return aria.getInvoiceDataPdf(accountId, invoiceNumber, 'pdf', token)
    .then((invoiceData) => {
      if (invoiceData) {
        return { invoiceData: invoiceData.toString('base64') };
      }
      return {};
    });
}

module.exports = getInvoice;
