const chai = require('chai');
const sinonChai = require('sinon-chai');
const dirtyChai = require('dirty-chai');
const sinon = require('sinon');
const sinonStubPromise = require('tc-sinon-stub-promise');
const BillingService = require('../../../src/controller/services/billingServices');
const testData = require('./account.testdata.json');
const getCidnAccounts = require('../../../src/controller/invoice/getCidnAccounts');

sinonStubPromise(sinon);
chai.should();
chai.use(sinonChai);
chai.use(dirtyChai);

const sandbox = sinon.sandbox.create();
const args = {
  company: 15054,
  bds_token: 'lSwIPGzurEtxvAKhjqjN4L',
};
const config = {};

describe('get Billing details', () => {
  let billingServiceStub;
  beforeEach(() => {
    billingServiceStub = sandbox.spy(() => new BillingService());
    billingServiceStub.getAccountNumbers = sandbox.stub(BillingService.prototype, 'getAccountNumbers');
  });

  afterEach(() => {
    sandbox.restore();
  });


  it('should return a list  ', () => {
    billingServiceStub.getAccountNumbers.resolves(testData.data);
    const value = getCidnAccounts(config, args);
    value.then((result) => {
      result.should.be.deep.equal(testData.responseData);
    });
  });
  it('should return empty  array  when no account exist', () => {
    billingServiceStub.getAccountNumbers.resolves(testData.emptyAccountsData);
    const value = getCidnAccounts(config, args);
    value.then((result) => {
      result.should.be.deep.equal(testData.emptyResponseData);
    });
  });
  it('should return empty  array  when company does not exist', () => {
    billingServiceStub.getAccountNumbers.resolves(testData.invalidData);
    const value = getCidnAccounts(config, args);
    value.then((result) => {
      result.should.be.deep.equal(testData.emptyResponseData);
    });
  });
  it('should return empty  object  when  does is null', () => {
    billingServiceStub.getAccountNumbers.resolves(null);
    const value = getCidnAccounts(config, args);
    value.then((result) => {
      result.should.be.deep.equal(testData.emptyResponseData);
    });
  });

  it('should return an exception', () => {
    billingServiceStub.getAccountNumbers.rejects(new Error('Address not found'));
    const value = getCidnAccounts(config, args);
    value.then(() => {}).catch((err) => {
      err.should.not.be.null();
    });
  });
});
