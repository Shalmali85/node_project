const Aria = require('../services/aria.js');
const moment = require('moment');
const { handleError } = require('../shared/errorHandler');


module.exports = function getLatestBillingInvoice(config, args, done) {
  const accountId = args.accountId.trim();
  const siteList = [];
  const token = args.token;
  const aria = new Aria();
  /* istanbul ignore next */
  aria.getLatestInvoiceData(accountId, 'json', token)
    .then((invoiceData) => {
      const billingData = invoiceData;
      if (billingData && billingData.customerAddress) {
        billingData.customerAddress.city = billingData.customerAddress.addressCity;
        delete billingData.customerAddress.addressCity;
      }
      if (billingData && billingData.invoiceDetails) {
        billingData.invoiceSummary = {};
        billingData.invoiceSummary.issueDate = billingData.invoiceDetails.invoiceIssueDate ? moment.utc(billingData.invoiceDetails.invoiceIssueDate).format('YYYY-MM-DDTHH:mm:ssZ') : '';
        billingData.invoiceSummary.period = billingData.invoiceDetails.invoicePeriod;
        billingData.invoiceSummary.accountId = billingData.invoiceDetails.accountNumber;
        billingData.invoiceSummary.invoiceNumber = billingData.invoiceDetails.invoiceNumber;
        delete billingData.invoiceDetails;
      }
      if (billingData && billingData.paymentSummary) {
        billingData.paymentSummary.dueDate = billingData.paymentSummary.dueDate ? moment.utc(billingData.paymentSummary.dueDate).format('YYYY-MM-DDTHH:mm:ssZ') : '';
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
          billingData.serviceSummary.accountLevelChargesAndCredits.adjustmentsExcludingGst =
                        billingData.serviceSummary.accountLevelChargesAndCredits.adjustmentsExcludingGstCost;
          billingData.serviceSummary.accountLevelChargesAndCredits.adjustmentsIncludingGst =
                        billingData.serviceSummary.accountLevelChargesAndCredits.adjustmentsIncludingGstCost;
          billingData.serviceSummary.accountLevelChargesAndCredits.totalNewChargesInBill =
                        billingData.serviceSummary.accountLevelChargesAndCredits.totalNewChargesInThisBill;
          delete
          billingData.serviceSummary.accountLevelChargesAndCredits.adjustmentsExcludingGstCost;
          delete
          billingData.serviceSummary.accountLevelChargesAndCredits.adjustmentsIncludingGstCost;
          delete billingData.serviceSummary.accountLevelChargesAndCredits.totalNewChargesInThisBill;
        }
      }
      return done(null, billingData);
    })
    .catch(error => done(handleError(error, config.billing.errorMessages)));
};
