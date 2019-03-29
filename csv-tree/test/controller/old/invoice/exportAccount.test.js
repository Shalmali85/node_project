const chai = require('chai');
const sinonChai = require('sinon-chai');
const dirtyChai = require('dirty-chai');
const sinon = require('sinon');
const sinonStubPromise = require('tc-sinon-stub-promise');
const proxyquire = require('proxyquire');
const getAccountInvoices = require('../../../../src/controller/old/invoice/getAccountInvoices');

sinonStubPromise(sinon);
chai.should();
chai.use(sinonChai);
chai.use(dirtyChai);

const sandbox = sinon.sandbox.create();

const args = {
  accountId: '700000000104',
};
const config = {};

const mockInvoiceData = {
  data:
        [
          {
            isSuccess: true,
            billingAccountId: '700000000104',
            invoiceNumber: '9900000000046',
            dueDate: '2018-06-01T00:00:00',
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

describe('get csv for billing account', () => {
  let exportAccounts;
  let getAccountsStub;
  beforeEach(() => {
    getAccountsStub = sandbox.stub(getAccountInvoices, 'getAccountInvoices');

    exportAccounts = proxyquire('../../../../src/controller/old/invoice/exportAccounts.js', {
      './getAccountInvoices': getAccountsStub,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });


  it('should return a billing details csv format', () => {
    getAccountsStub.resolves(mockInvoiceData.data);
    exportAccounts(config, args).then((result) => {
      result.should.not.be.empty;
    });
  });
  it('should return an exception when no data to be parsed csv format', () => {
    getAccountsStub.resolves([]);
    exportAccounts(config, args).then(() => {
      should.throw('No data found to be exported');
    });
  });
});
