const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const proxyquire = require('proxyquire');
const chai = require('chai');
const config = require('../../../../../../application.json');
const testData = require('../../../../invoice/billing.testdata.json');
const billing = require('../../../../../../src/controller/old_v2/invoice/getBillingAccountDetails');
const formatError = require('../../../../../../src/controller/shared/formatError');

chai.should();

const dirtyChai = require('dirty-chai');

const sandbox = sinon.sandbox.create();
chai.use(sinonChai);
chai.use(dirtyChai);


describe('get', () => {
  let billingStub;
  let sendJson;
  let requestStub;
  let getApi;

  beforeEach(() => {
    billingStub = sandbox.stub(billing, 'billingAccountDetails');
    sendJson = sandbox.spy();
    requestStub = {

    };
    getApi = proxyquire('../../../../../../src/controller/billing/v2/account/_accountId/get', {
      '../../../../old_v2/invoice/getBillingAccountDetails': billingStub,

    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('success', async () => {
    const request = Object.assign(requestStub, { args: { accountId: '200034767920' } });
    billingStub.resolves(testData.responseData);
    getApi.init(config);
    await getApi.handler(request, { sendJson });
    sendJson.should.have.been.calledOnce;
    sendJson.args[0]['1'].should.be.equal(200);
  });

  it('account returns error', async () => {
    const request = Object.assign(requestStub, { args: { accountId: '200034767' } });
    const error = new Error('Address not found');
    billingStub.rejects(formatError(error));
    getApi.init(config);
    await getApi.handler(request, { sendJson });
    sendJson.should.have.been.calledOnce;
    sendJson.args[0]['1'].should.be.equal('500');
  });

  it('account returns error for unexpected scenario', async () => {
    getApi.init(config);
    await getApi.handler(null, { sendJson });
    sendJson.should.have.been.calledOnce;
    sendJson.args[0]['1'].should.be.equal('500');
  });
});
