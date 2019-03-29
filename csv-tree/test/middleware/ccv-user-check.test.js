const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const dirtyChai = require('dirty-chai');
const proxyquire = require('proxyquire');
const ServiceError = require('tc-utilities/error/ServiceError');
const rp = require('request-promise');

const should = chai.should();
const req = {
  args: {
    token: 'lSwIPGzurEtxvAKhjqjN4L',
  },
};
const response = {
  data: [
    {
      id: 12,
      cidn: '123',
      name: 'ANZ',
    },
  ],
};
const responseInvalid = { data: [] };


chai.use(sinonChai);
chai.use(dirtyChai);
const config = {
  ccvCustomersUrl: 'mockUrl',
};
const sandbox = sinon.sandbox.create();
describe('ccv user check', () => {
  let validateUser;
  let next;
  let ccvUserCheck;
  let rpStub;

  beforeEach(() => {
    rpStub = sandbox.stub();
    validateUser = sandbox.stub();
    next = sandbox.spy();


    ccvUserCheck = proxyquire('../../src/middleware/ccv-user-check', {
      'request-promise': rpStub,
    });
    rpStub.resolves(response);
  });


  afterEach(() => {
    sandbox.restore();
  });

  it('success for  api ', async () => {
    const request = { args: { token: 'lSwIPGzurEtxvAKhjqjN4L' } };
    rpStub.resolves(response);
    validateUser.resolves(response);
    await ccvUserCheck(config, request, null, next);
    request.args.should.be.deep.equal(req.args);
    next.should.have.been.calledOnce();
    next.getCall(0).args.length.should.equal(0);
  });

  it('success for  api without argument ', async () => {
    const request = {};
    rpStub.resolves(response);
    validateUser.resolves(response);
    await ccvUserCheck(config, request, null, next);
    request.args.should.be.deep.equal({});
    next.should.have.been.calledOnce();
    next.getCall(0).args.length.should.equal(0);
  });
});
describe('ccv user error', () => {
  let validateUser;
  let next;
  let ccvUserCheck;
  let rpStub;
  let json;
  let status;

  beforeEach(() => {
    rpStub = sandbox.stub();
    validateUser = sandbox.stub();
    next = sandbox.spy();
    json = sandbox.spy();
    status = sandbox.stub();


    ccvUserCheck = proxyquire('../../src/middleware/ccv-user-check', {
      'request-promise': rpStub,
    });
    rpStub.resolves(response);
  });


  afterEach(() => {
    sandbox.restore();
  });
  it('access denied', async () => {
    const request = { args: { token: 'lSwIPGzurEtxvAKhjqjN4L' } };
    rpStub.resolves(responseInvalid);
    validateUser.resolves(responseInvalid);
    status.withArgs(403).returns({ json });
    await ccvUserCheck(config, request, { status }, next);
    next.should.not.have.been.calledOnce();
    status.args[0]['0'].should.be.equal(403);
    json.should.have.been.calledOnce();
  });
  it('failure address not found', async () => {
    rpStub.rejects(new Error('Address not found'));
    const request = { args: {} };
    status.withArgs(500).returns({ json });
    await ccvUserCheck(config, request, { status }, next);
    next.should.not.have.been.calledOnce();
    status.args[0]['0'].should.be.equal(500);
    json.should.have.been.calledOnce();
  });
});
