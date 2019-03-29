const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const dirtyChai = require('dirty-chai');
const BillingService = require('../../src/controller/services/billingServices');
const proxyquire = require('proxyquire');
const testData = require('../controller/services/bds.testdata.json');
const getAccountNumbers = require('../../src/controller/shared/getAccountNumbers.js');

const should = chai.should();
const config = {};

chai.use(sinonChai);
chai.use(dirtyChai);

const sandbox = sinon.sandbox.create();
describe('billing account validator', () => {
  let billingServiceStub;
  let next;
  let billingAccountValidator;
  let status;
  let json;
  let getAccountsStub;

  beforeEach(() => {
    next = sandbox.spy();
    status = sandbox.stub();
    json = sandbox.spy();
    billingServiceStub = sandbox.spy(() => new BillingService());
    billingServiceStub.getAccountNumbers = sandbox.stub(BillingService.prototype, 'getAccountNumbers');
    getAccountsStub = sandbox.stub(getAccountNumbers.prototype, 'getAccountNumbers');
    billingAccountValidator = proxyquire('../../src/middleware/billing-account-validator', {
      '../controller/services/billingServices.js': billingServiceStub,
      '../controller/shared/getAccountNumbers.js': getAccountsStub,
    });
  });


  afterEach(() => {
    sandbox.restore();
  });

  it('success', async () => {
    billingServiceStub.getAccountNumbers.resolves(testData.accounts);
    const request = { query: {}, params: { accountId: '700000000012' }, args: { company: 15054 } };
    await billingAccountValidator(config, request, null, next);
    next.should.have.been.calledOnce();
    next.getCall(0).args.length.should.equal(0);
  });

  it('success when no parameter as accountId exists', async () => {
    const request = { query: {}, params: { }, args: { company: 15054 } };
    await billingAccountValidator(config, request, null, next);
    next.should.have.been.calledOnce();
    next.getCall(0).args.length.should.equal(0);
  });

  it('failure when ban belongs to other cidn', async () => {
    billingServiceStub.getAccountNumbers.resolves(testData.accounts);
    status.withArgs(400).returns({ json });
    const request = { query: {}, params: { accountId: '700096522802' }, args: { company: 15054 } };
    await billingAccountValidator(config, request, { status }, next);
    next.should.not.have.been.calledOnce();
    status.args[0]['0'].should.be.equal(400);
    json.should.have.been.calledOnce();
  });

  it('failure due to couchbase ', async () => {
    billingServiceStub.getAccountNumbers.rejects(new Error('Cidn does not exist'));
    status.withArgs(500).returns({ json });
    const request = { query: {}, params: { accountId: '700096522802' }, args: { company: 15054 } };
    await billingAccountValidator(config, request, { status }, next);
    next.should.not.have.been.calledOnce();
    status.args[0]['0'].should.be.equal(500);
    json.should.have.been.calledOnce();
  });
});
