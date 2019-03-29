const chai = require('chai');
const sinonChai = require('sinon-chai');
const dirtyChai = require('dirty-chai');
const sinon = require('sinon');
const sinonStubPromise = require('tc-sinon-stub-promise');
const proxyquire = require('proxyquire');
const queryHelper = require('../../../src/controller/shared/queryHelper');

chai.use(sinonChai);
chai.use(dirtyChai);
sinonStubPromise(sinon);
const sandbox = sinon.sandbox.create();
const response = { cas: 123,
  value: {
    customerBillingAccountData: [
      {
        CIDN: '2700009810',
        billingIds: [
          '700000000104',
        ],
      },
      {
        CIDN: '15054',
        billingIds: [
          '700000000104',
          '700000000104',
        ],
      },
      {
        CIDN: '5748548',
        billingIds: [
          '700000000104',
          '700000000104',
        ],
      },
    ],
  } };
const expectedData = { billingAccountIds: [
  '700000000104',
  '700000000104',
] };
const config = {
  '$.couchbase': {
    url: 'http://localhost:8091',
    bucketName: 'default',
  },
};

const invalidConfig = {
  '$.couchbase': {
    url: 'http://localhost:8091',
    bucketName: 'invalid',
  },
};

const customerId = '15054';

describe('test getCustomerData', () => {
  let callback;
  let getAccountNumbers;
  let queryHelperStub;

  beforeEach(() => {
      queryHelperStub = sandbox.stub(queryHelper, 'queryHelper');

    callback = sandbox.spy(callback);

    getAccountNumbers = proxyquire('../../../src/controller/shared/getAccountNumbers.js', {
      queryHelper: {
          queryHelper: queryHelperStub,
      },
    });
      queryHelperStub.getBillingAccountNumbers = sandbox.stub(queryHelper, 'getBillingAccountNumbers');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should read data from couch db.', () => {
     queryHelperStub.getBillingAccountNumbers.resolves(response);
    getAccountNumbers(config, customerId).then((result) => {
      result.should.deep.equal(expectedData);
    });
  });

  describe('errors scenarios', () => {
    it('should return error when config is not supplied', () => {
        getAccountNumbers(null, customerId).catch((error) => {
        error.should.be.an.instanceof(Error);
        error.message.should.equal('Config is mandatory');
      });
    });
    it('should return Error  when bucket name is not supplied', () => {
      queryHelperStub.getBillingAccountNumbers.rejects(new Error('Random Error'));
      getAccountNumbers(invalidConfig, customerId).catch((error) => {
        error.should.be.an.instanceof(Error);
      });
    });
    it('should return Error when company id is not provided', () => {
      queryHelperStub.getBillingAccountNumbers.rejects(new Error('Random Error'));
      getAccountNumbers(config, null).catch((error) => {
        error.should.be.an.instanceof(Error);
        error.message.should.equal('Customer id is not provided, expecting a string');
      });
    });
    it('should return Error when document name is not provided', () => {
      queryHelperStub.getBillingAccountNumbers.rejects(new Error('Random Error'));
      getAccountNumbers(config, customerId, 'blah').catch((error) => {
        error.should.be.an.instanceof(Error);
      });
    });
  });
});
