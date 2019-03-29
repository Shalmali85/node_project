const chai = require('chai');
const exportToCsvTree = require('../../../src/controller/shared/exportToCsvTree');
const testData = require('../invoice/billing.testdata.json');

const should = chai.should();
const data = {
  data: {
    sites: [
      {
        companyName: 'abcd',
        test: {
          onceOffCharges: [{charge: '12345'}, {charge: '1234567', fruits: [{fruit: 'apple'}]}],
          onceOffCharges2: [{charge: '12345'}, {charge: '1234567'}],

        },
      },
      {
        companyName: 'abcdefg',
        onceOffCharges: [{ charge: '56789' }, { charge: '5678977' }],

      },
    ],
    invoiceData: {
      invoiceNumber: 9000000,
    },
  },
};
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

describe('display json in csv format', () => {
  it('should return comma separated data', () => {
    const result = exportToCsvTree(testData.responseData, fields);
    result.should.not.be.empty;
  });
  it('should return comma separated datafor dynamic structure', () => {
    const result = exportToCsvTree(data);
    result.should.not.be.empty;
  });
  it('should return comma separated data with one serviceCharges', () => {
    const result = exportToCsvTree(testData.responseDataCsv, fields);
    result.should.not.be.empty;
  });

});

