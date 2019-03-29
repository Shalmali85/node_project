const chai = require('chai');
const exportToCsv = require('../../../src/controller/shared/exportToCsv');

const should = chai.should();


const accounts = [
  {
    amountDue: 1320,
    balanceCarriedForward: 880,
    billingAccountId: '700000000104',
    dueDate: '2018-06-01T00:00:00+00:00',
    invoiceNumber: '9900000000046',
    newCharges: 440,
  },

];

const fields = [{ label: 'Account ID', value: 'billingAccountId' }, { label: 'Invoice number', value: 'invoiceNumber' }, { label: 'Due date', value: 'dueDate' }, { label: 'Balance carried forward', value: 'balanceCarriedForward' }, { label: 'New charges', value: 'newCharges' }, { label: 'Amount due', value: 'amountDue' }];


describe('display json in csv format', () => {
  it('should return comma separated data', () => {
    const result = exportToCsv(accounts, fields);
    result.should.not.be.empty;
  });

  it('should return error when cannot parse', () => {
    const result = exportToCsv([], null);
    result.should.be.instanceOf(Error);
  });
});

