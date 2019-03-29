const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const proxyquire = require('proxyquire');
const chai = require('chai');
const config = require('../../../../../../../application.json');
const exportAccounts = require('../../../../../../../src/controller/invoice/exportAccounts');

chai.should();

const dirtyChai = require('dirty-chai');

const sandbox = sinon.sandbox.create();
chai.use(sinonChai);
chai.use(dirtyChai);

const value = '"Account ID","Invoice number","Due date","Balance carried forward","New charges","Amount due"\r\n"700000000104","9900000000046","2018-06-01T00:00:00+00:00",880,440,1320';

describe('get', () => {
  let exportAccountsStub;
  let send;
  let header;
  let requestStub;
  let getApi;

  beforeEach(() => {
    exportAccountsStub = sandbox.stub(exportAccounts, 'exportAccounts');
    send = sandbox.spy();
    header = sandbox.spy();
    requestStub = {};
    getApi = proxyquire('../../../../../../../src/controller/billing/v3/export/invoices/_accountId/get', {
      '../../../../../invoice/exportAccounts': exportAccountsStub,

    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('success', async () => {
    const request = Object.assign(requestStub, { args: { accountId: '700000000104' } });
    exportAccountsStub.resolves(value);
    getApi.init(config);
    await getApi.handler(request, { header, send });
    send.should.have.been.calledOnce;
    send.args[0]['1'].should.be.equal(200);
  });
});

describe('get', () => {
  let exportAccountsStub;
  let sendJson;
  let requestStub;
  let getApi;

  beforeEach(() => {
    exportAccountsStub = sandbox.stub(exportAccounts, 'exportAccounts');
    sendJson = sandbox.spy();
    requestStub = {

    };
    getApi = proxyquire('../../../../../../../src/controller/billing/v3/export/invoices/_accountId/get', {
      '../../../../../invoice/exportAccounts': exportAccountsStub,

    });
  });

  afterEach(() => {
    sandbox.restore();
  });


  it('account export invoices returns error', async () => {
    const request = Object.assign(requestStub, { args: { account: '700000000104' } });
    const error = new Error('Address not found');
    exportAccountsStub.rejects(error);
    getApi.init(config);
    await getApi.handler(request, { sendJson });
    sendJson.should.have.been.calledOnce;
    sendJson.args[0]['1'].should.be.equal('500');
  });

  it('account export invoices returns error for unexpected scenario', async () => {
    getApi.init(config);
    getApi.handler(null, { sendJson });
    sendJson.should.have.been.calledOnce;
    sendJson.args[0]['1'].should.be.equal('500');
  });
});
