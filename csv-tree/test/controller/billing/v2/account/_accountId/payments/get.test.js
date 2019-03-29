const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const proxyquire = require('proxyquire');
const chai = require('chai');
const config = require('../../../../../../../application.json');
const invoicePaymentSummary = require('../../../../../../../src/controller/invoice/invoicePaymentSummary');

const data = require('../../../../../services/bds.testdata.json')
chai.should();

const dirtyChai = require('dirty-chai');

const sandbox = sinon.sandbox.create();
chai.use(sinonChai);
chai.use(dirtyChai);


describe('get', () => {
  let invoicePaymentStub;
  let sendJson;
  let requestStub;
  let getApi;

  beforeEach(() => {
    invoicePaymentStub = sandbox.stub(invoicePaymentSummary, 'invoicePaymentSummary');
    sendJson = sandbox.spy();
    requestStub = {

    };
    getApi = proxyquire('../../../../../../../src/controller/billing/v2/account/_accountId/payments/get', {
      '../../../../../invoice/invoicePaymentSummary': invoicePaymentStub,

    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('success', async() => {
    const request = Object.assign(requestStub, { args: { accountId: '7000965228', invoiceNumber: '1479432', bds_token: 'lSwIPGzurEtxvAKhjqjN4L' } });
    invoicePaymentStub.resolves(data.data);
    getApi.init(config);
    await getApi.handler(request, { sendJson });
    sendJson.should.have.been.calledOnce;
    sendJson.args[0]['1'].should.be.equal(200);
  });

  it('account invoice payments returns error', async() => {
    const request = Object.assign(requestStub, { args: { accountId: '7000965228', invoiceNumber: '1479432', bds_token: 'lSwIPGzurEtxvAKhjqjN4L' } });
    const error = new Error('Address not found');
    invoicePaymentStub.rejects(error);
    getApi.init(config);
    await getApi.handler(request, { sendJson });
    sendJson.should.have.been.calledOnce;
    sendJson.args[0]['1'].should.be.equal('500');
  });

  it('account invoice payments returns error for unexpected scenario', async() => {
    getApi.init(config);
    await getApi.handler(null, { sendJson });
    sendJson.should.have.been.calledOnce;
    sendJson.args[0]['1'].should.be.equal('500');
  });
});
