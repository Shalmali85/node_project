const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const proxyquire = require('proxyquire');
const sinonStubPromise = require('tc-sinon-stub-promise');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiSubset = require('chai-subset');
const dirtyChai = require('dirty-chai');
const getAccountNumbers = require('../../../src/controller/shared/getAccountNumbers');
const { promisify } = require('util');

chai.should();
const sandbox = sinon.sandbox.create();
chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.use(dirtyChai);
sinonStubPromise(sinon);
chai.use(chaiSubset);

const args = {
  company: '15054',
};

const argsFilter = {
  company: '15054',
  filter: '{"billingAccountId":"700000000104"}',
};

const config = {
  couchbase: {
    url: 'mockUrl',
    bucket: 'default',
  },
  '$.billing': {
    message: {
      'account does not exist': 'Account does not exist',
      'No statement sequence id is generated for this client account id': 'Currently no invoices are available for this account',
      'No billing accounts available': 'No billing accounts available',
    },
  },
};
const mockInvoiceData = {
  data:
  [
    {
      isSucess: true,
      billingAccountId: 700000000104,
      invoiceNumber: 16643042,
      dueDate: '08 Apr 18',
      newCharges: 240,
      balanceCarriedForward: 1452,
      amountDue: 1692,
    },
  ],
};
describe('given success scenario for all Billing Accounts data', () => {
  let getAccounts;
  let getAccountNumbersStub;
  beforeEach(() => {
    getAccountNumbersStub = sandbox.stub(getAccountNumbers, 'getAccountNumbers');
    getAccountNumbersStub.returnsPromise().resolves({ billingAccountIds: [
      '700000000104',
      '700000000104',
    ] });
    getAccounts = promisify(proxyquire('../../../src/controller/invoice/getAccounts.js', {
      getAccountNumbers: {
        getAccountNumbers: getAccountNumbersStub,
      },
    }));
  });

  afterEach(() => {
    sandbox.restore();
  });


  it('should return account data', () => {
    getAccountNumbersStub.withArgsPromised(config, args.company).resolves({ billingAccountIds: [
      '700000000104',
      '700000000104',
    ] });
    getAccounts(config, args).then((result) => {
      result.should.be.deep.equal(mockInvoiceData.data);
    });
  });

  it('should return account data when filtered for specific billing Id', () => {
    getAccountNumbersStub.withArgsPromised(config, args.company).resolves({ billingAccountIds: [
      '700000000104',
      '700000000104',
    ] });
    getAccounts(config, argsFilter).then((result) => {
      result.should.be.deep.equal(mockInvoiceData.data);
    });
  });
});

describe('given errors scenario for all Billing Accounts data', () => {
  let getAccounts;
  let getAccountNumbersDataStub;
  beforeEach(() => {
    getAccountNumbersDataStub = sandbox.stub(getAccountNumbers, 'getAccountNumbers');
    getAccountNumbersDataStub.returnsPromise().returns({ billingAccountIds: [] });
    getAccounts = promisify(proxyquire('../../../src/controller/invoice/getAccounts.js', {
      getAccountNumbers: {
        getAccountNumbers: getAccountNumbersDataStub,
      },
    }));
  });

  afterEach(() => {
    sandbox.restore();
  });
  it('should return error when config is not supplied', () => {
    getAccounts(config, {}).catch((error) => {
      error.should.be.an.instanceOf(Error);
    });
  });

  it('should return empty response when couchdb does not have billing Ids', () => {
    getAccountNumbersDataStub.withArgsPromised(config, args.company).returns(
      { billingAccountIds: [] });
    getAccounts(config, args).then((result) => {
      result.should.be.deep.equal([]);
    });
  });
});
