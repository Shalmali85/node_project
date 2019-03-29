const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const dirtyChai = require('dirty-chai');
const BillingServices = require('../../src/controller/services/billingServices');
const testData = require('../controller/services/bds.testdata.json');
const proxyquire = require('proxyquire');
const NodeCache = require('node-cache');
const ServiceError = require('tc-utilities/error/ServiceError');


let cache = new NodeCache();

const should = chai.should();

const req = {
  args: {
    bds_token: 'lSwIPGzurEtxvAKhjqjN4L',
  },
};
chai.use(sinonChai);
chai.use(dirtyChai);
const config = {
  bds: {
    bds_token_url: 'mockURL',
    bds_client_id: 'abcd',
    bds_client_secret: 'secret',
    bds_grant_type: 'client_credentials',

  },
  billing: {
      errorMessages: {
      'account does not exist': 'Account does not exist',
      'No statement sequence id is generated for this client account id': 'Currently no invoices are available for this account',
      'No billing accounts available': 'No billing accounts available',
    },
  },
};
const sandbox = sinon.sandbox.create();
describe('bds token generator', () => {
  let billingServiceStub;
  let next;
  let bdsTokenGenerator;


  beforeEach(() => {
    billingServiceStub = sandbox.stub(BillingServices.prototype, 'billingServices');
    billingServiceStub.generateToken = sandbox.stub(BillingServices.prototype, 'generateToken');
    next = sandbox.spy();


    bdsTokenGenerator = proxyquire('../../src/middleware/bds-token-generator', {
      '../controller/services/billingServices': billingServiceStub,
    });
  });


  afterEach(() => {
    sandbox.restore();
  });

  it('success for  api without cache', async () => {
    billingServiceStub.generateToken.resolves(testData.token);
    const request = { args: {} };
    await bdsTokenGenerator(config, request, null, next);
    request.args.should.be.deep.equal(req.args);
    next.should.have.been.calledOnce();
    next.getCall(0).args.length.should.equal(0);
  });
});
describe('bds token caching', () => {
  let billingServiceStub;
  let next;
  let bdsTokenGenerator;
  let cacheStub;

  beforeEach(() => {
    billingServiceStub = sandbox.stub(BillingServices.prototype, 'billingServices');
    billingServiceStub.generateToken = sandbox.stub(BillingServices.prototype, 'generateToken');
    next = sandbox.spy();
    cacheStub = sandbox.stub(NodeCache.prototype, 'cache');
    cacheStub.get = sandbox.stub(NodeCache.prototype, 'get');
    bdsTokenGenerator = proxyquire('../../src/middleware/bds-token-generator', {
      '../controller/services/billingServices': billingServiceStub,
      'node-cache': cacheStub,
    });
  });


  afterEach(() => {
    sandbox.restore();
  });

  it('success with cached in token', async () => {
    billingServiceStub.generateToken.resolves(testData.token);
    cacheStub.get.returns(req.args.bds_token);
    const request = { };
    await bdsTokenGenerator(config, request, null, next);
    request.args.should.be.deep.equal(req.args);
    next.should.have.been.calledOnce();
    next.getCall(0).args.length.should.equal(0);
  });
});
describe('bds token', () => {
  let billingServiceStub;
  let next;
  let bdsTokenGenerator;
  let json;
  let status;

  beforeEach(() => {
    billingServiceStub = sandbox.stub(BillingServices.prototype, 'billingServices');
    billingServiceStub.generateToken = sandbox.stub(BillingServices.prototype, 'generateToken');
    json = sandbox.spy();
    next = sandbox.spy();
    cache = sandbox.spy();
    status = sandbox.stub();
    bdsTokenGenerator = proxyquire('../../src/middleware/bds-token-generator', {
      '../controller/services/billingServices': billingServiceStub,
    });
  });


  afterEach(() => {
    sandbox.restore();
  });

  it('failure for missing config', async () => {
    billingServiceStub.generateToken.rejects(new ServiceError('400', 'B400', 'Client configuration missing'));
    const request = { args: {} };
    status.withArgs(400).returns({ json });
    await bdsTokenGenerator(null, request, { status }, next);
    next.should.not.have.been.calledOnce();
    status.args[0]['0'].should.be.equal(400);
    json.should.have.been.calledOnce();
  });
  it('failure address not found', async () => {
    billingServiceStub.generateToken.rejects(new Error('Address not found'));
    const request = { args: {} };
    status.withArgs(500).returns({ json });
    await bdsTokenGenerator(config, request, { status }, next);
    next.should.not.have.been.calledOnce();
    status.args[0]['0'].should.be.equal(500);
    json.should.have.been.calledOnce();
  });
});
