const exportToCsvTree = require('../shared/exportToCsvTree');
const ServiceError = require('tc-utilities/error/ServiceError');
const getBillingAccountDetails = require('./getBillingAccountDetails');

module.exports = function exportInvoiceDetails(config, args) {
  return getBillingAccountDetails(config, args).then((result) => {
    if (result) {
      const fields = [{ label: 'Customer address', value: 'customerAddress' }, { label: 'Company name', value: 'companyName' },
        { label: 'Address', value: 'addressLine1' }, { label: 'State and Postal Code', value: 'stateAndPostalCode' }, { label: 'City', value: 'city' },
        { label: 'Payment', value: 'paymentSummary' }, { label: 'Balance carried forward', value: 'balanceCarriedForward' }, { label: 'Total Due', value: 'totalDue' },
        { label: 'Payments received last period', value: 'paymentsReceivedLastPeriod' }, { label: 'Due date', value: 'dueDate' },
        { label: 'New charges', value: 'newCharges' }, { label: 'Service summary', value: 'serviceSummary' }, { label: 'Account level charges and credits', value: 'accountLevelChargesAndCredits' },
        { label: 'Gross total bill', value: 'grossTotalBill' }, { label: 'GST included in gross total bill', value: 'amountOfGstIncludedInGrossTotalBill' },
        { label: 'GST free items included  in new charges', value: 'gstFreeItemsIncludedInNewCharges' }, { label: 'GST included in new charges', value: 'gstIncludedInNewCharges' },
        { label: 'GST included in adjustments', value: 'gstIncludedInAdjustments' }, { label: 'Adjustment excluding GST', value: 'adjustmentsExcludingGst' }, { label: 'Adjustment including GST', value: 'adjustmentsIncludingGst' },
        { label: 'Total new charges in this bill', value: 'totalNewChargesInBill' }, { label: 'Site', value: 'sites' },
        { label: 'Location', value: 'physicalLocationName' }, { label: 'Site cost excluding GST', value: 'siteCostExcludingGst' },
        { label: 'Site cost including GST', value: 'siteCostIncludingGst' }, { label: 'Offer name', value: 'offerName' },
        { label: 'Services and charges', value: 'servicesAndCharges' }, { label: 'Out of plan charges', value: 'outOfPlanCharges' },
        { label: 'Service type', value: 'serviceType' }, { label: 'Quantity', value: 'quantity' },
        { label: 'Cost excluding GST', value: 'costExcludingGst' }, { label: 'Cost including GST', value: 'costIncludingGst' }, { label: 'Once off charges', value: 'onceOffCharges' },
        { label: 'Invoice Summary', value: 'invoiceSummary' }, { label: 'Issue date', value: 'issueDate' }, { label: 'Period', value: 'period' },
        { label: 'Account Number', value: 'accountId' }, { label: 'Invoice Number', value: 'invoiceNumber' }];
      const data = exportToCsvTree(result, fields);
      return data;
    }
    throw new ServiceError('422', 'B422', 'No data found to be exported');
  });
};
