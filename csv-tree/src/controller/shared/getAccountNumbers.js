const queryHelper = require('./queryHelper');

function transformData(data, customerId) {
  const billingAccountIds = [];
  data.customerBillingAccountData.forEach((element) => {
    if (element.CIDN === customerId) {
      billingAccountIds.push(...element.billingIds);
    }
  });
  return { billingAccountIds };
}

function getAccountNumbers(config, customerId, documentId = 'customerBillingAccountData') {
  if (!config) {
    return Promise.reject(new Error('Config is mandatory'));
  }
  if (!customerId || typeof customerId !== 'string') {
    return Promise.reject(new Error('Customer id is not provided, expecting a string'));
  }
  return queryHelper.getBillingAccountNumbers(config, documentId)
    .then(result => transformData(result.value, customerId));
}

module.exports = getAccountNumbers;
