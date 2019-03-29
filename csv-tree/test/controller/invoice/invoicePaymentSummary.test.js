const chai = require('chai');
const sinonChai = require('sinon-chai');
const dirtyChai = require('dirty-chai');
const sinon = require('sinon');
const sinonStubPromise = require('tc-sinon-stub-promise');
const BillingService = require('../../../src/controller/services/billingServices');
const testData = require('./payment.testdata.json');
const invoicePaymentSummary = require('../../../src/controller/invoice/invoicePaymentSummary');

sinonStubPromise(sinon);
chai.should();
chai.use(sinonChai);
chai.use(dirtyChai);

const sandbox = sinon.sandbox.create();
const args = {
  accountId: '7000965228',
  invoiceNumber: '1479432',
  bds_token: 'lSwIPGzurEtxvAKhjqjN4L',
};

const invalidArgs = {
  accountId: '7000965228',
};

describe('get Billing details', () => {
  let billingServiceStub;
  beforeEach(() => {
    billingServiceStub = sandbox.spy(() => new BillingService());
    billingServiceStub.getAccountInvoicePayment = sandbox.stub(BillingService.prototype, 'getAccountInvoicePayment');
  });

  afterEach(() => {
    sandbox.restore();
  });


  it('should return a invoice payments details reponse', () => {
    billingServiceStub.getAccountInvoicePayment.resolves(testData.data);
    const value = invoicePaymentSummary(args);
    value.then((result) => {
      result.should.be.deep.equal(testData.responseData);
    });
  });

  it('should return empty reponse when objects are missing', () => {
    billingServiceStub.getAccountInvoicePayment.resolves({});
    const value = invoicePaymentSummary(args);
    value.then((result) => {
      result.should.be.deep.equal(testData.nopaymentResponseData);
    });
  });

  it('should return empty reponse when payments array does not exist', () => {
    billingServiceStub.getAccountInvoicePayment.resolves(testData.nopaymentOnlyData);
    const value = invoicePaymentSummary(args);
    value.then((result) => {
      result.should.be.deep.equal(testData.nopaymentResponseData);
    });
  });
  it('should return empty payment array  when no payments made', () => {
    billingServiceStub.getAccountInvoicePayment.resolves(testData.nopaymentData);
    const value = invoicePaymentSummary(args);
    value.then((result) => {
      result.should.be.deep.equal(testData.nopaymentResponseData);
    });
  });

  it('should return empty dates  when objects are missing', () => {
    billingServiceStub.getAccountInvoicePayment.resolves(testData.invalidData);
    const value = invoicePaymentSummary(args);
    value.then((result) => {
      result.should.be.deep.equal(testData.invalidResponseData);
    });
  });

  it('should return an exception', () => {
    billingServiceStub.getAccountInvoicePayment.rejects(new Error('Address not found'));
    const value = invoicePaymentSummary(args);
    value.then(() => {}).catch((err) => {
      err.should.not.be.null();
    });
  });
  it('should return an exception when invoiceNumber is missing ', () => {
    (function () {
      invoicePaymentSummary(invalidArgs);
    }).should.throw('Invoice Number is mandatory');
  });
});
