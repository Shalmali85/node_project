const chai = require('chai');
const sinonChai = require('sinon-chai');
const dirtyChai = require('dirty-chai');
const sinon = require('sinon');
const sinonStubPromise = require('tc-sinon-stub-promise');
const Aria = require('../../../../src/controller/services/aria');
const testData = require('./billing.testdata.json');
const getBillingAccountDetails = require('../../../../src/controller/old/invoice/getBillingAccountDetails');

sinonStubPromise(sinon);
chai.should();
chai.use(sinonChai);
chai.use(dirtyChai);
const config = { specId: {
  onceOffCharges: { key: 'BSOTC001_CB', value: 'onceOffCharges' },
} };
const sandbox = sinon.sandbox.create();
const args = {
  accountId: '200034767920',
  invoiceNumber: '9900000001164',
};
const invalidArgs = {
  accountId: '200034767920',
};

describe('get Billing details', () => {
  let ariaStub;
  // let getBillingAccountDetails;

  beforeEach(() => {
    ariaStub = sandbox.spy(() => new Aria());
    ariaStub.getInvoiceData = sandbox.stub(Aria.prototype, 'getInvoiceData');
  });

  afterEach(() => {
    sandbox.restore();
  });


  it('should return a billing details reponse', () => {
    ariaStub.getInvoiceData.resolves(testData.data);
    const value = getBillingAccountDetails(config, args);
    value.then((result) => {
      result.should.be.deep.equal(testData.responseData);
    });
  });

  it('should return empty reponse when objects are missing', () => {
    ariaStub.getInvoiceData.resolves({});
    const value = getBillingAccountDetails(config, args);
    value.then((result) => {
      result.should.be.deep.equal({});
    });
  });

  it('should return empty dates  when objects are missing', () => {
    ariaStub.getInvoiceData.resolves(testData.invalidData);
    const value = getBillingAccountDetails(config, args);
    value.then((result) => {
      result.should.be.deep.equal(testData.invalidResponseData);
    });
  });

  it('should return an exception', () => {
    ariaStub.getInvoiceData.rejects(new Error('Random Error'));
    const value = getBillingAccountDetails(config, args);
    value.then(() => {
    }).catch((err) => {
      err.should.not.be.null();
    });
  });

  it('should return an exception when invoiceNumber is missing ', () => {
    (function () {
      getBillingAccountDetails(config, invalidArgs);
    }).should.throw('Invoice Number is mandatory');
  });
});
