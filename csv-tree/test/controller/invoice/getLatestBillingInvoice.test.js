const chai = require('chai');
const sinonChai = require('sinon-chai');
const dirtyChai = require('dirty-chai');
const sinon = require('sinon');
const sinonStubPromise = require('tc-sinon-stub-promise');
const proxyquire = require('proxyquire');
const Aria = require('../../../src/controller/services/aria.js');
const testData = require('./billing.testdata.json');

sinonStubPromise(sinon);
chai.should();
chai.use(sinonChai);
chai.use(dirtyChai);

const sandbox = sinon.sandbox.create();
const args = {
  accountId: '200034767920',
  token: 'Bearer abcd',

};
const config = {
  billing: {
      errorMessages: {
      'account does not exist': 'Account does not exist',
      'No statement sequence id is generated for this client account id': 'Currently no invoices are available for this account',
      'No billing accounts available': 'No billing accounts available',
    },
  } };
describe('get Billing details', () => {
  let ariaStub;
  let getLatestBillingInvoice;
  beforeEach(() => {
    ariaStub = sandbox.spy(() => new Aria());


    getLatestBillingInvoice = proxyquire('../../../src/controller/invoice/getLatestBillingInvoice.js', {
      aria: ariaStub,
    });
    ariaStub.getLatestInvoiceData = sandbox.stub(Aria.prototype, 'getLatestInvoiceData');
  });

  afterEach(() => {
    sandbox.restore();
  });


  it('should return a billing details reponse', () => {
    ariaStub.getLatestInvoiceData.resolves(testData.data);
    getLatestBillingInvoice(config, args, (err, result) => {
      result.should.be.deep.equal(testData.responseData);
    });
  });

  it('should return empty reponse when objects are missing', () => {
    ariaStub.getLatestInvoiceData.resolves({});
    getLatestBillingInvoice(config, args, (err, result) => {
      result.should.be.deep.equal({});
    });
  });

  it('should return empty dates  when objects are missing', () => {
    ariaStub.getLatestInvoiceData.resolves(testData.invalidData);
    getLatestBillingInvoice(config, args, (err, result) => {
      result.should.be.deep.equal(testData.invalidResponseData);
    });
  });

  it('should return an exception', () => {
    ariaStub.getLatestInvoiceData.rejects(new Error('Random Error'));
    getLatestBillingInvoice(config, args, (err) => {
      err.should.not.be.null();
    });
  });
});
