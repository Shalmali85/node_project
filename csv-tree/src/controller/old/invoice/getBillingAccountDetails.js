/* eslint-disable max-len */
const Aria = require('../../services/aria.js');
const moment = require('moment');
const ServiceError = require('tc-utilities/error/ServiceError');


function parseBillingData(invoiceData, siteList) {
  const billingData = invoiceData;
  if (billingData && billingData.customerAddress) {
    billingData.customerAddress.city = billingData.customerAddress.addressCity;
    delete billingData.customerAddress.addressCity;
  }
  if (billingData && billingData.invoiceDetails) {
    billingData.invoiceSummary = {};
    billingData.invoiceSummary.issueDate = billingData.invoiceDetails.invoiceIssueDate ? moment(billingData.invoiceDetails.invoiceIssueDate, 'DD MMM YY').format('YYYY-MM-DDTHH:mm:ss') : '';
    billingData.invoiceSummary.period = billingData.invoiceDetails.invoicePeriod;
    billingData.invoiceSummary.accountId = billingData.invoiceDetails.accountNumber;
    billingData.invoiceSummary.invoiceNumber = billingData.invoiceDetails.invoiceNumber;
    delete billingData.invoiceDetails;
  }
  if (billingData && billingData.paymentSummary) {
    billingData.paymentSummary.dueDate = billingData.paymentSummary.dueDate ? moment(billingData.paymentSummary.dueDate, 'DD MMM YY').format('YYYY-MM-DDTHH:mm:ss') : '';
  }
  if (billingData && billingData.serviceSummary &&
        billingData.serviceSummary.lineLevelDetails) {
    billingData.serviceSummary.lineLevelDetails.forEach((details) => {
      const sites = {};
      sites.physicalLocationName = details.physicalLocationName;
      sites.siteCostExcludingGst = details.siteExcludingGstCost;
      sites.siteCostIncludingGst = details.siteIncludingGstCost;
      const formattedServiceList = [];
      details.listOfSiteServicesAndCharges.forEach((listOfSiteServicesAndCharges) => {
        const formattedServiceObject = {};
        formattedServiceObject.serviceType = listOfSiteServicesAndCharges.serviceType;
        formattedServiceObject.quantity = listOfSiteServicesAndCharges.quantity;
        formattedServiceObject.costExcludingGst = listOfSiteServicesAndCharges.excludingGstCost;
        formattedServiceObject.costIncludingGst = listOfSiteServicesAndCharges.includingGstCost;
        formattedServiceList.push(formattedServiceObject);
      });
      sites.servicesAndCharges = formattedServiceList;
      siteList.push(sites);
    });
    billingData.serviceSummary.sites = siteList;
    delete billingData.serviceSummary.lineLevelDetails;
    if (billingData.serviceSummary.accountLevelChargesAndCredits) {
      billingData.serviceSummary.accountLevelChargesAndCredits.adjustmentsExcludingGst = billingData.serviceSummary.accountLevelChargesAndCredits.adjustmentsExcludingGstCost;
      billingData.serviceSummary.accountLevelChargesAndCredits.adjustmentsIncludingGst = billingData.serviceSummary.accountLevelChargesAndCredits.adjustmentsIncludingGstCost;
      billingData.serviceSummary.accountLevelChargesAndCredits.totalNewChargesInBill = billingData.serviceSummary.accountLevelChargesAndCredits.totalNewChargesInThisBill;
      delete
      billingData.serviceSummary.accountLevelChargesAndCredits.adjustmentsExcludingGstCost;
      delete
      billingData.serviceSummary.accountLevelChargesAndCredits.adjustmentsIncludingGstCost;
      delete billingData.serviceSummary.accountLevelChargesAndCredits.totalNewChargesInThisBill;
    }
  }
  return billingData;
}

module.exports = function getBillingAccountDetails(config, args) {
  const accountId = args.accountId.trim();
  const siteList = [];
  if (!args.invoiceNumber) {
    throw new ServiceError('400', 'B400', 'Invoice Number is mandatory');
  }
  const invoiceNumber = args.invoiceNumber.trim();
  const token = args.token;
  const aria = new Aria();
  return aria.getInvoiceData(accountId, invoiceNumber, 'json', token)
    .then((invoiceData) => {
      const billingData = parseBillingData(invoiceData, siteList);
      return billingData;
    });
};
