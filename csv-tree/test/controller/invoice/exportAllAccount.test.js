const chai = require('chai');
const sinonChai = require('sinon-chai');
const dirtyChai = require('dirty-chai');
const sinon = require('sinon');
const sinonStubPromise = require('tc-sinon-stub-promise');
const proxyquire = require('proxyquire');
const getAccounts = require('../../../src/controller/invoice/getAccounts');

sinonStubPromise(sinon);
chai.should();
chai.use(sinonChai);
chai.use(dirtyChai);

const sandbox = sinon.sandbox.create();

const args = {
  company: '15054',
};
const config = {
  billing: {
    errorMessages: {
      'account does not exist': { type: 'G422', message: 'Account does not exist' },
      'No statement sequence id is generated for this client account id': { type: 'C422', message: 'Currently no invoices are available for this account' },
      'No billing accounts available': { type: 'G422', message: 'No billing accounts available' },
    },
  } };

const mockInvoiceData = {
  data:
        [
          {
            isSuccess: true,
            billingAccountId: '700000000104',
            invoiceNumber: '9900000000046',
            dueDate: '2018-06-01T00:00:00+00:00',
            newCharges: 440,
            balanceCarriedForward: 880,
            amountDue: 1320,
          },
        ],
};
const mockInvoiceErrorData = {
  data:
        [
          {
            isSuccess: false,
            billingAccountId: '700000000104',
            errorMessage: 'Account does not exist',
          },
        ],
};
const mockErrorData = {
  data:
        [
          {
            isSuccess: true,
          },
        ],
};
const value = '"Account ID","Invoice number","Due date","Balance carried forward","New charges","Amount due"\r\n"700000000104","9900000000046","2018-06-01T00:00:00+00:00",880,440,1320';

describe('get csv for billing accounts', () => {
  let exportAccounts;
  let getAccountsStub;
  beforeEach(() => {
    getAccountsStub = sandbox.stub(getAccounts, 'getAccounts');

    exportAccounts = proxyquire('../../../src/controller/invoice/exportAllAccounts.js', {
      './getAccounts': getAccountsStub,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });


  it('should return a billing details csv format', () => {
    const stub = getAccountsStub.yields(null, mockInvoiceData.data).returns(mockInvoiceData.data);
    const callback = sinon.spy();
    const response = stub(callback);
    response.should.be.deep.equal(mockInvoiceData.data);
    exportAccounts(config, args, (err, result) => {
      result.should.not.be.empty;
    });
  });
  it('should return an exception when no data to be parsed csv format', () => {
    const stub = getAccountsStub.yields(null, mockInvoiceErrorData.data).returns(mockInvoiceErrorData.data);
    const callback = sinon.spy();
    const response = stub(callback);
    response.should.be.deep.equal(mockInvoiceErrorData.data);
    exportAccounts(config, args, (err) => {
      err.should.be.instanceOf(Error);
    });
  });
  it('should return an exception', () => {
    const error = new Error('Address not found');
    const stub = getAccountsStub.yields(error).returns(error);
    const callback = sinon.spy();
    const response = stub(callback);
    response.should.be.instanceOf(Error);
    exportAccounts(config, args, (err) => {
      err.should.be.instanceOf(Error);
    });
  });
});
