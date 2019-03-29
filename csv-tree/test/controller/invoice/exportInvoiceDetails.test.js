const chai = require('chai');
const sinonChai = require('sinon-chai');
const dirtyChai = require('dirty-chai');
const sinon = require('sinon');
const sinonStubPromise = require('tc-sinon-stub-promise');
const proxyquire = require('proxyquire');
const getBillingAccountDetails = require('../../../src/controller/invoice/getBillingAccountDetails');
const testData = require('./billing.testdata.json');

sinonStubPromise(sinon);
chai.should();
chai.use(sinonChai);
chai.use(dirtyChai);

const sandbox = sinon.sandbox.create();

const args = {
  accountId: '700000000104',
};
const config = {};


describe('get csv for billing account', () => {
  let exportInvoiceDetails;
  let getBillingAccountDetailsStub;
  beforeEach(() => {
    getBillingAccountDetailsStub = sandbox.stub(getBillingAccountDetails, 'getBillingAccountDetails');

    exportInvoiceDetails = proxyquire('../../../src/controller/invoice/exportInvoiceDetails.js', {
      './getBillingAccountDetails': getBillingAccountDetailsStub,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });


  it('should return a billing details csv format', () => {
    getBillingAccountDetailsStub.resolves(testData.responseData);
    exportInvoiceDetails(config, args).then((result) => {
      result.should.not.be.empty;
    });
  });
  it('should return an exception when no data to be parsed csv format', () => {
    getBillingAccountDetailsStub.resolves(null);
      exportInvoiceDetails(config, args).then(() => {
      should.throw('No data found to be exported');
    });
  });
});
