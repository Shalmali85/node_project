const Aria = require('../services/aria.js');
const { handleError } = require('../shared/errorHandler');

function getAccountLatestInvoice(config, args, done) {
  const accountId = args.accountId.trim();
  const token = args.token;
  const aria = new Aria();
  aria.getLatestInvoiceData(accountId, 'pdf', token)
    .then((invoiceData) => {
      if (invoiceData) {
        return done(null, { invoiceData: invoiceData.toString('base64') });
      }
      return done(null, {});
    }).catch(error => done(handleError(error, config.billing.errorMessages)));
}

module.exports = getAccountLatestInvoice;
