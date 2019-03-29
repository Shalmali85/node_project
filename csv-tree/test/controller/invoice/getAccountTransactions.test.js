const chai = require('chai');
const sinonChai = require('sinon-chai');
const dirtyChai = require('dirty-chai');
const sinon = require('sinon');
const sinonStubPromise = require('tc-sinon-stub-promise');
const BillingService = require('../../../src/controller/services/billingServices');
const testData = require('./payment.testdata.json');
const getAccountTransactions = require('../../../src/controller/invoice/getAccountTransactions');

sinonStubPromise(sinon);
chai.should();
chai.use(sinonChai);
chai.use(dirtyChai);

const sandbox = sinon.sandbox.create();
const args = {
  accountId: '7000965228',
  bds_token: 'lSwIPGzurEtxvAKhjqjN4L',
};
const args_trans = {
  accountId: '7000965228',
  bds_token: 'lSwIPGzurEtxvAKhjqjN4L',
  transactionId: '195870322',
};
describe('get Billing details', () => {
  let billingServiceStub;
  beforeEach(() => {
    billingServiceStub = sandbox.spy(() => new BillingService());
    billingServiceStub.getTransactionDetails = sandbox.stub(BillingService.prototype, 'getTransactionDetails');
  });

  afterEach(() => {
    sandbox.restore();
  });


  it('should return a tarnsactions  reponse', () => {
    billingServiceStub.getTransactionDetails.resolves(testData.transactions);
    const value = getAccountTransactions(args);
    value.then((result) => {
      result.should.be.deep.equal(testData.transactionsResponse);
    });
  });

  it('should return a transaction deatils for a transaction id ', () => {
    billingServiceStub.getTransactionDetails.resolves(testData.invoices);
    const value = getAccountTransactions(args_trans);
    value.then((result) => {
      result.should.be.deep.equal(testData.invoicesResponse);
    });
  });
  it('should return a transaction deatils for a transaction id when no date exist ', () => {
    billingServiceStub.getTransactionDetails.resolves(testData.invoicesInvalidDate);
    const value = getAccountTransactions(args_trans);
    value.then((result) => {
      result.should.be.deep.equal(testData.invoicesInvalidDateResponse);
    });
  });
});
