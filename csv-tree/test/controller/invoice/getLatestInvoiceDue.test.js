const chai = require('chai');
const sinonChai = require('sinon-chai');
const dirtyChai = require('dirty-chai');
const sinon = require('sinon');
const sinonStubPromise = require('tc-sinon-stub-promise');
const Aria = require('../../../src/controller/services/aria.js');
const testData = require('./billing.testdata.json');
const getLatestInvoiceDue = require('../../../src/controller/invoice/getLatestInvoiceDue');

sinonStubPromise(sinon);
chai.should();
chai.use(sinonChai);
chai.use(dirtyChai);

const sandbox = sinon.sandbox.create();
const args = {
  accountId: '200034767920',
  token: 'Bearer abcd',

};
const config = {};

describe('get latest Billing Invoice due details', () => {
  let ariaStub;
  beforeEach(() => {
    ariaStub = sandbox.spy(() => new Aria());
    ariaStub.getLatestInvoiceData = sandbox.stub(Aria.prototype, 'getLatestInvoiceData');
  });

  afterEach(() => {
    sandbox.restore();
  });


  it('should return a billing details reponse', () => {
    ariaStub.getLatestInvoiceData.resolves(testData.data);
    const value = getLatestInvoiceDue(config, args);
    value.then((result) => {
      result.should.be.deep.equal(testData.latestDueResponse);
    });
  });
  it('should return a billing details reponse when date doe snot exist', () => {
    ariaStub.getLatestInvoiceData.resolves(testData.invalidResponseData);
    const value = getLatestInvoiceDue(config, args);
    value.then((result) => {
      result.should.be.deep.equal(testData.latestInvalidDueResponse);
    });
  });
  it('should return an exception  when objects are missing', () => {
    ariaStub.getLatestInvoiceData.resolves({});
    const value = getLatestInvoiceDue(config, args);
    value.then(() => {
    }).catch((err) => {
      err.should.not.be.null();
    });
  });


  it('should return an exception', () => {
    ariaStub.getLatestInvoiceData.rejects(new Error('Random Error'));
    const value = getLatestInvoiceDue(config, args);
    value.then(() => {
    }).catch((err) => {
      err.should.not.be.null();
    });
  });

});
