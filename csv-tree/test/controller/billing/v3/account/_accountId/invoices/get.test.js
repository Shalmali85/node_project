const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const proxyquire = require('proxyquire');
const chai = require('chai');
const config = require('../../../../../../../application.json');
const testData = require('../../../../../invoice/billing.testdata.json');
const accounts = require('../../../../../../../src/controller/invoice/getAccountInvoices');

chai.should();

const dirtyChai = require('dirty-chai');

const sandbox = sinon.sandbox.create();
chai.use(sinonChai);
chai.use(dirtyChai);


describe('get', () => {
  let accountStub;
  let sendJson;
  let requestStub;
  let getApi;

  beforeEach(() => {
    accountStub = sandbox.stub(accounts, 'accounts');
    sendJson = sandbox.spy();
    requestStub = {

    };
    getApi = proxyquire('../../../../../../../src/controller/billing/v3/account/_accountId/invoices/get', {
      '../../../../../invoice/getAccountInvoices': accountStub,

    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('success', async() => {
    const request = Object.assign(requestStub, { args: { company: '15054' } });
    accountStub.resolves(null, testData.data);
    getApi.init(config);
    await getApi.handler(request, { sendJson });
    sendJson.should.have.been.calledOnce;
    sendJson.args[0]['1'].should.be.equal(200);
  });

  it('account invoices returns error', async() => {
    const request = Object.assign(requestStub, { args: { company: '15054' } });
    const error = new Error('Address not found');
    accountStub.rejects(error);
    getApi.init(config);
    await getApi.handler(request, { sendJson });
    sendJson.should.have.been.calledOnce;
    sendJson.args[0]['1'].should.be.equal('500');
  });

  it('account invoices returns error for unexpected scenario', async () => {
    getApi.init(config);
    await getApi.handler(null, { sendJson });
    sendJson.should.have.been.calledOnce;
    sendJson.args[0]['1'].should.be.equal('500');
  });
});
