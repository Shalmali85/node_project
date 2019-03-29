const chai = require('chai');
const sinonChai = require('sinon-chai');
const dirtyChai = require('dirty-chai');
const sinon = require('sinon');
const sinonStubPromise = require('tc-sinon-stub-promise');
const Aria = require('../../../src/controller/services/aria');
const getInvoice = require('../../../src/controller/invoice/getInvoice');

sinonStubPromise(sinon);
chai.should();
chai.use(sinonChai);
chai.use(dirtyChai);

const sandbox = sinon.sandbox.create();
const args = {
  accountId: '200034767920',
  invoiceNumber: '9900000001164',

};

const invalidArgs = {
  accountId: '200034767920',
};

const config = {};

describe('get Invoice details', () => {
  let ariaStub;
  beforeEach(() => {
    ariaStub = sandbox.spy(() => new Aria());


    ariaStub.getInvoiceDataPdf = sandbox.stub(Aria.prototype, 'getInvoiceDataPdf');
  });

  afterEach(() => {
    sandbox.restore();
  });


  it('should return a billing details reponse', () => {
    ariaStub.getInvoiceDataPdf.resolves('abcd');
    const value = getInvoice(config, args);
    value.then((result) => {
      result.should.be.deep.equal({ invoiceData: 'abcd' });
    });
  });
  it('should return an empty object', () => {
    ariaStub.getInvoiceDataPdf.resolves(null);
    const value = getInvoice(config, args);
    value.then((result) => {
      result.should.be.deep.equal({});
    });
  });
  it('should return an exception', () => {
    ariaStub.getInvoiceDataPdf.rejects(new Error('Random Error'));
    const value = getInvoice(config, args);
    value.then(() => {}).catch((err) => {
      err.should.not.be.null();
    });
  });

  it('should return an exception when invoiceNumber is missing ', () => {
    (function () {
      getInvoice(config, invalidArgs);
    }).should.throw('Invoice Number is mandatory');
  });
});
