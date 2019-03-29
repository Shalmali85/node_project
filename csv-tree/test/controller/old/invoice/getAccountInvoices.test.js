const chai = require('chai');
const sinonChai = require('sinon-chai');
const dirtyChai = require('dirty-chai');
const sinon = require('sinon');
const sinonStubPromise = require('tc-sinon-stub-promise');
const proxyquire = require('proxyquire');
const Aria = require('../../../../src/controller/services/aria.js');
const testData = require('../../services/aria.testdata.json');
const getAccountInvoices = require('../../../../src/controller/old/invoice/getAccountInvoices');

sinonStubPromise(sinon);
chai.should();
chai.use(sinonChai);
chai.use(dirtyChai);

const sandbox = sinon.sandbox.create();
const args = {
  accountId: '700000008513',

};

const mockInvoiceData = {
  data:
        [
          {
            isSuccess: true,
            billingAccountId: '700000008513',
            invoiceNumber: '9900000029196',
            dueDate: '2018-08-15T00:00:00',
            newCharges: 70.07,
            balanceCarriedForward: 350.35,
            amountDue: 420.42,
          },
        ],
};

const config = {};


describe('get All Invoices', () => {
  let ariaStub;
  beforeEach(() => {
    ariaStub = sandbox.spy(() => new Aria());
    ariaStub.getAllInvoices = sandbox.stub(Aria.prototype, 'getAllInvoices');
  });

  afterEach(() => {
    sandbox.restore();
  });


  it('should return a billing details reponse', () => {
    ariaStub.getAllInvoices.resolves(testData.data);
    const value = getAccountInvoices(config, args);
    value.then((result) => {
      result.should.deep.equal(mockInvoiceData.data);
    });
  });
  it('should return an empty object', () => {
    ariaStub.getAllInvoices.resolves(null);
    const value = getAccountInvoices(config, args);
    value.then((result) => {
      result.should.deep.equal([]);
    });
  });
  it('should return an exception', () => {
    ariaStub.getAllInvoices.rejects(new Error('Random Error'));
    const value = getAccountInvoices(config, args);
    value.then(() => {}).catch((err) => {
      err.should.not.be.null();
    });
  });
});
