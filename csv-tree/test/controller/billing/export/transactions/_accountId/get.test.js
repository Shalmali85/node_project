const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const proxyquire = require('proxyquire');
const chai = require('chai');
const config = require('../../../../../../application.json');
const exportAccountTransactions = require('../../../../../../src/controller/invoice/exportAccountTransactions');

chai.should();

const dirtyChai = require('dirty-chai');

const sandbox = sinon.sandbox.create();
chai.use(sinonChai);
chai.use(dirtyChai);
const value = '"Telstra transaction ID","Date received","Amount received ($)","Amount applied to invoices ($)","Amount added as credit ($)" \r\n "195883843","2018-06-12T00:00:00",4000,0,4000';

describe('get', () => {
  let exportTransactionStub;
  let send;
  let header;
  let requestStub;
  let getApi;

  beforeEach(() => {
    exportTransactionStub = sandbox.stub(exportAccountTransactions, 'exportAccountTransactions');
    send = sandbox.spy();
    header = sandbox.spy();
    requestStub = {};
    getApi = proxyquire('../../../../../../src/controller/billing/export/transactions/_accountId/get', {
      '../../../../invoice/exportAccountTransactions': exportTransactionStub,

    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('success', async () => {
    const request = Object.assign(requestStub, { args: { accountId: '700000000104' } });
    exportTransactionStub.resolves(value);
    getApi.init(config);
    await getApi.handler(request, { header, send });
    send.should.have.been.calledOnce;
    send.args[0]['1'].should.be.equal(200);
  });
});

describe('get', () => {
  let exportTransactionStub;
  let sendJson;
  let requestStub;
  let getApi;

  beforeEach(() => {
    exportTransactionStub = sandbox.stub(exportAccountTransactions, 'exportAccountTransactions');
    sendJson = sandbox.spy();
    requestStub = {

    };
    getApi = proxyquire('../../../../../../src/controller/billing/export/transactions/_accountId/get', {
      '../../../../invoice/exportAccountTransactions': exportTransactionStub,

    });
  });

  afterEach(() => {
    sandbox.restore();
  });


  it('account returns error', async () => {
    const request = Object.assign(requestStub, { args: { account: '700000000104' } });
    const error = new Error('Address not found');
    exportTransactionStub.rejects(error);
    getApi.init(config);
    await getApi.handler(request, { sendJson });
    sendJson.should.have.been.calledOnce;
    sendJson.args[0]['1'].should.be.equal('500');
  });

  it('account returns error for unexpected scenario', async () => {
    getApi.init(config);
    getApi.handler(null, { sendJson });
    sendJson.should.have.been.calledOnce;
    sendJson.args[0]['1'].should.be.equal('500');
  });
});
