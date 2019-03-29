const chai = require('chai');
const sinonChai = require('sinon-chai');
const dirtyChai = require('dirty-chai');
const sinon = require('sinon');
const sinonStubPromise = require('tc-sinon-stub-promise');
const proxyquire = require('proxyquire');
const Aria = require('../../../src/controller/services/aria.js');

sinonStubPromise(sinon);
chai.should();
chai.use(sinonChai);
chai.use(dirtyChai);

const sandbox = sinon.sandbox.create();
const args = {
  accountId: '200034767920',
  token: 'Bearer abcd',
};
const config = {
  billing: {
    errorMessages: {
      'account does not exist': { type: 'G422', message: 'Account does not exist' },
      'No statement sequence id is generated for this client account id': { type: 'C422', message: 'Currently no invoices are available for this account' },
      'No billing accounts available': { type: 'G422', message: 'No billing accounts available' },
    },
  } };

describe('get Invoice details', () => {
  let ariaStub;
  let getInvoice;
  beforeEach(() => {
    ariaStub = sandbox.spy(() => new Aria());


    getInvoice = proxyquire('../../../src/controller/invoice/getAccountLatestInvoice.js', {
      aria: ariaStub,
    });
    ariaStub.getLatestInvoiceData = sandbox.stub(Aria.prototype, 'getLatestInvoiceData');
  });

  afterEach(() => {
    sandbox.restore();
  });


  it('should return a billing details reponse', () => {
    ariaStub.getLatestInvoiceData.resolves('abcd');
    getInvoice(config, args, (err, result) => {
      result.should.be.deep.equal({ invoiceData: 'abcd' });
    });
  });
  it('should return an empty object', () => {
    ariaStub.getLatestInvoiceData.resolves(null);
    getInvoice(config, args, (err, result) => {
      result.should.be.deep.equal({});
    });
  });
  it('should return an exception', () => {
    ariaStub.getLatestInvoiceData.rejects(new Error('Random Error'));
    getInvoice(config, args, (err) => {
      err.should.not.be.null();
    });
  });
});
