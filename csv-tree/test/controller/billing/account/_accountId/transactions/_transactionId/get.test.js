const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const proxyquire = require('proxyquire');
const chai = require('chai');
const config = require('../../../../../../../application.json');
const getAccountTransactions = require('../../../../../../../src/controller/invoice/getAccountTransactions');


const data = require('../../../../../services/bds.testdata.json');

chai.should();

const dirtyChai = require('dirty-chai');

const sandbox = sinon.sandbox.create();
chai.use(sinonChai);
chai.use(dirtyChai);


describe('get', () => {
  let getAccountTransactionsStub;
  let sendJson;
  let requestStub;
  let getApi;

  beforeEach(() => {
    getAccountTransactionsStub = sandbox.stub(getAccountTransactions, 'getAccountTransactions');
    sendJson = sandbox.spy();
    requestStub = {

    };
    getApi = proxyquire('../../../../../../../src/controller/billing/account/_accountId/transactions/_transactionId/get', {
      '../../../../../invoice/getAccountTransactions': getAccountTransactionsStub,

    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('success', async () => {
    const request = Object.assign(requestStub, { args: { accountId: '7000965228', bds_token: 'lSwIPGzurEtxvAKhjqjN4L' } });
    getAccountTransactionsStub.resolves(data.invoices);
    getApi.init(config);
    await getApi.handler(request, { sendJson });
    sendJson.should.have.been.calledOnce;
    sendJson.args[0]['1'].should.be.equal(200);
  });

  it('account invoice payments returns error', async () => {
    const request = Object.assign(requestStub, { args: { accountId: '7000965228', bds_token: 'lSwIPGzurEtxvAKhjqjN4L' } });
    const error = new Error('Address not found');
    getAccountTransactionsStub.rejects(error);
    getApi.init(config);
    await getApi.handler(request, { sendJson });
    sendJson.should.have.been.calledOnce;
    sendJson.args[0]['1'].should.be.equal('500');
  });

  it('account invoice payments returns error for unexpected scenario', async () => {
    getApi.init(config);
    await getApi.handler(null, { sendJson });
    sendJson.should.have.been.calledOnce;
    sendJson.args[0]['1'].should.be.equal('500');
  });
});
