const moment = require('moment');
const _ = require('lodash');

const sortColumns = ['isSuccess', 'dueDate', 'billingAccountId'];
const sortOrders = ['desc', 'desc', 'asc'];

function parseJson(datum) {
  const result = {};
  const data = datum.invoiceData || datum;
  /* istanbul ignore if */
  if (data && data.invoiceDetails && data.invoiceDetails.accountNumber
    && data.invoiceDetails.invoiceNumber) {
    result.isSuccess = true;
    result.billingAccountId = data.invoiceDetails.accountNumber;
    result.invoiceNumber = data.invoiceDetails.invoiceNumber;
    result.dueDate = data.paymentSummary.dueDate ? moment(data.paymentSummary.dueDate, 'DD MMM YY').format('YYYY-MM-DDTHH:mm:ss') : '';
    result.newCharges = data.paymentSummary.newCharges;
    result.balanceCarriedForward = data.paymentSummary.balanceCarriedForward;
    result.amountDue = data.paymentSummary.totalDue;
    return result;
  }
  return datum;
}

function getBillingData(data) {
  let allAccountsData = [];
  if (!data || !Array.isArray(data)) {
    return new Error('invalid data !');
  }
  data.forEach((item) => {
    allAccountsData.push(parseJson(item));
  });
  allAccountsData = _.orderBy(allAccountsData, sortColumns, sortOrders);
  return allAccountsData;
}

module.exports = getBillingData;
