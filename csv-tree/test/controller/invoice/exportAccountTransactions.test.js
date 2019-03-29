const chai = require('chai');
const sinonChai = require('sinon-chai');
const dirtyChai = require('dirty-chai');
const sinon = require('sinon');
const sinonStubPromise = require('tc-sinon-stub-promise');
const proxyquire = require('proxyquire');
const getAccountTransactions = require('../../../src/controller/invoice/getAccountTransactions');

sinonStubPromise(sinon);
chai.should();
chai.use(sinonChai);
chai.use(dirtyChai);

const sandbox = sinon.sandbox.create();

const args = {
  accountId: '700000000104',
};
const config = {};

const mockInvoiceData = {
  data: {
    billingAccountNumber: '7000965228',
    transactions: [
      {
        transactionId: '195883843',
        dateReceived: '2018-06-12T00:00:00',
        amountReceived: 4000,
        amountApplied: 0,
        amountCredited: 4000,
      },
      {
        transactionId: '195870322',
        dateReceived: '',
        amountReceived: 4000,
        amountApplied: 600,
        amountCredited: 3400,
      },

    ],
  },
};


describe('get csv for billing account', () => {
  let exportAccountTransactions;
  let getTransactionStub;
  beforeEach(() => {
    getTransactionStub = sandbox.stub(getAccountTransactions, 'getAccountTransactions');

    exportAccountTransactions = proxyquire('../../../src/controller/invoice/exportAccountTransactions.js', {
      './getAccountTransactions': getTransactionStub,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });


  it('should return a billing details csv format', () => {
    getTransactionStub.resolves(mockInvoiceData.data);
    exportAccountTransactions(args).then((result) => {
      result.should.not.be.empty;
    });
  });
  it('should return an exception when no data to be parsed csv format', () => {
    getTransactionStub.resolves([]);
    exportAccountTransactions(args).then(() => {
      should.throw('No data found to be exported');
    });
  });
});
