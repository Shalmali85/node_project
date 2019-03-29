const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const proxyquire = require('proxyquire');
const chai = require('chai');
const config = require('../../../../../application.json');
const getCidnAccounts = require('../../../../../src/controller/invoice/getCidnAccounts');
const ServiceError = require('tc-utilities/error/ServiceError');
const formatError = require('../../../../../src/controller/shared/formatError');

const data = require('../../../services/bds.testdata.json');

chai.should();

const dirtyChai = require('dirty-chai');

const sandbox = sinon.sandbox.create();
chai.use(sinonChai);
chai.use(dirtyChai);


describe('get', () => {
  let getCidnAccountStub;
  let sendJson;
  let requestStub;
  let getApi;

  beforeEach(() => {
    getCidnAccountStub = sandbox.stub(getCidnAccounts, 'getCidnAccounts');
    sendJson = sandbox.spy();
    requestStub = {

    };
    getApi = proxyquire('../../../../../src/controller/billing/company/accounts/get', {
      '../../../invoice/getCidnAccounts': getCidnAccountStub,

    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('success', async() => {
    const request = Object.assign(requestStub, { args: { company: 15054, bds_token: 'lSwIPGzurEtxvAKhjqjN4L' } });
    getCidnAccountStub.resolves(data.accounts);
    getApi.init(config);
    await getApi.handler(request, { sendJson });
    sendJson.should.have.been.calledOnce;
    sendJson.args[0]['1'].should.be.equal(200);
  });

  it('account invoice payments returns error', async() => {
    const request = Object.assign(requestStub, { args: { company: 15054, bds_token: 'lSwIPGzurEtxvAKhjqjN4L' } });
    const error = new Error('Address not found');
    getCidnAccountStub.rejects(error)(formatError(error));
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
