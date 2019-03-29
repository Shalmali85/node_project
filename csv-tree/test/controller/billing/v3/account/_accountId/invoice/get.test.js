const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const proxyquire = require('proxyquire');
const chai = require('chai');
const config = require('../../../../../../../application.json');
const invoiceDetails = require('../../../../../../../src/controller/invoice/getInvoice');
const ServiceError = require('tc-utilities/error/ServiceError');
const formatError = require('../../../../../../../src/controller/shared/formatError');

const data = { invoiceData: 'abcd' };
chai.should();

const dirtyChai = require('dirty-chai');

const sandbox = sinon.sandbox.create();
chai.use(sinonChai);
chai.use(dirtyChai);


describe('get', () => {
  let invoiceStub;
  let sendJson;
  let requestStub;
  let getApi;

  beforeEach(() => {
    invoiceStub = sandbox.stub(invoiceDetails, 'invoiceDetails');
    sendJson = sandbox.spy();
    requestStub = {

    };
    getApi = proxyquire('../../../../../../../src/controller/billing/v3/account/_accountId/invoice/get', {
      '../../../../../invoice/getInvoice': invoiceStub,

    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('success', async () => {
    const request = Object.assign(requestStub, { args: { accountId: '12345' } });
    invoiceStub.resolves(data);
    getApi.init(config);
    await getApi.handler(request, { sendJson });
    sendJson.should.have.been.calledOnce;
    sendJson.args[0]['1'].should.be.equal(200);
  });

  it('account invoice  returns error', async () => {
    const request = Object.assign(requestStub, { args: { accountId: '12345' } });
    const error = new Error('Address not found');
    invoiceStub.rejects(error);
    getApi.init(config);
    await getApi.handler(request, { sendJson });
    sendJson.should.have.been.calledOnce;
    sendJson.args[0]['1'].should.be.equal('500');
  });

  it('account invoice returns error for unexpected scenario', async () => {
    getApi.init(config);
    await getApi.handler(null, { sendJson });
    sendJson.should.have.been.calledOnce;
    sendJson.args[0]['1'].should.be.equal('500');
  });
});
