const chai = require('chai');
const sinonChai = require('sinon-chai');
const dirtyChai = require('dirty-chai');
const sinon = require('sinon');
const sinonStubPromise = require('tc-sinon-stub-promise');
const proxyquire = require('proxyquire');

const should = chai.should();
const testData = require('./accountstestdata.json');

chai.use(sinonChai);
chai.use(dirtyChai);
sinonStubPromise(sinon);


const data = [
  {
    isSuccess: true,
    amountDue: 1320,
    balanceCarriedForward: 880,
    billingAccountId: '700000000104',
    invoiceIssueDate: '2019-06-01T00:00:00',
    invoiceNumber: '9900000000046',
    newCharges: 440,
  },

];
const invalidData = [
  {
    isSuccess: true,
    amountDue: 1320,
    balanceCarriedForward: 880,
    billingAccountId: '700000000104',
    invoiceIssueDate: '',
    invoiceNumber: '9900000000046',
    newCharges: 440,
  },
];
const noAccountData = [{ isSuccess: false, billingAccountId: 700000, errorMessage: 'Account does not exists' }];

describe('get Billing Data', () => {
  const getAccountsData = proxyquire('../../../src/controller/shared/getBillingData.js', {});

  it('should return account data', () => {
    const result = getAccountsData(testData.mock);
    result.should.be.deep.equal(data);
  });

  it('should return valid json for accountId does not exist', () => {
    const result = getAccountsData(testData.noAccounts);
    result.should.be.deep.equal(noAccountData);
  });

  it('should return empty date', () => {
    const result = getAccountsData(testData.emptyDate);
    result.should.be.deep.equal(invalidData);
  });

  it('should return error', () => {
    const result = getAccountsData(null);
    result.should.be.an.instanceOf(Error);
  });

  it('should return empty response', () => {
    const result = getAccountsData([{}]);
    result.should.be.deep.equal([{}]);
  });
});
