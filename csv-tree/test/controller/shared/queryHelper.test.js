const mocha = require('mocha');
const chai = require('chai');
const sinon = require('sinon');
const DataStore = require('tc-datastore').DataStore;
const queryHelper = require('../../../src/controller/shared/queryHelper.js');

chai.should();

const sandbox = sinon.sandbox.create();
const data = { cas: 123456,
  value: {
    customerBillingAccountData: [
      {
        CIDN: '2309090900',
        billingIds: [
          '700000004395',
        ],
      }] } };

const config = {
  'couchbase':
        {
          url: 'mockUrl',
          bucket: 'default',
        },
};

describe('Billing Query Helper', () => {
  let dataStoreStub;

  function setupDataStoreStubs() {
    dataStoreStub.getAsync = sandbox.stub(DataStore.prototype, 'getAsync');
  }


  beforeEach(() => {
    dataStoreStub = sandbox.spy(() => new DataStore());
    setupDataStoreStubs();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should return list if documentId  is  present', () => {
    const documentId = 'mock';
    dataStoreStub.getAsync.resolves(data);
    const result = queryHelper.getBillingAccountNumbers(config, documentId);
    result.then((value) => {
      value.should.deep.equal(data);
    });
  });
  it('should return empty list  when documentId not there', () => {
    const documentId = 'mock';
    dataStoreStub.getAsync.resolves(null);
    const result = queryHelper.getBillingAccountNumbers(config, documentId);
    result.then((value) => {
      value.should.deep.equal([]);
    });
  });

  it('should return error  when connection issue is null', () => {
    const documentId = 'mock';
    dataStoreStub.getAsync.rejects(new Error('Connection Error'));
    const result = queryHelper.getBillingAccountNumbers(config, documentId);
    result.then((value) => {
      value.should.be.empty();
    }).catch((err) => {
      err.should.not.equal(null);
    });
  });
});
