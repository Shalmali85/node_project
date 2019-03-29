const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chai = require('chai');
const dirtyChai = require('dirty-chai');
const mocha = require('mocha');
const proxyquire = require('proxyquire');
const auth = require('@microservice.telstra-connect.telstraglobal.com/auth');

const sandbox = sinon.sandbox.create();
chai.use(sinonChai);
chai.use(dirtyChai);

require('chai').should();

const VError = require('verror');

const {
  it,
  describe,
  beforeEach,
  afterEach,
} = mocha;

const testData = require('./authorize.testdata.json');

function createVError(name, message) {
  return new VError({ name }, message);
}

describe('authorize', () => {
  let authorize;
  let verifyStub;
  let claimsModifierStub;
  let status;
  let next;
  let requestStub;
  let errorSpy;
  let json;

  beforeEach(() => {
    verifyStub = sandbox.stub(auth, 'verify');
    claimsModifierStub = sandbox.stub();
    status = sandbox.stub();
    next = sandbox.spy();
    errorSpy = sandbox.spy();
    json = sandbox.spy();
    requestStub = {
      log: {
        error: errorSpy,
      },
    };

    authorize = proxyquire('../../src/middleware/authorize', {
      '@microservice.telstra-connect.telstraglobal.com/auth': auth,
      '@microservice.telstra-connect.telstraglobal.com/claims-modifier': claimsModifierStub,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('success', async () => {
    const data = testData.c1;
    verifyStub.withArgs(data.expected.token, data.expected.config.auth).returns(data.claims);
    // identity transformation
    claimsModifierStub.withArgs(data.expected.claims).returns(data.claims);
    const request = Object.assign({}, data.request);
    await authorize(data.config, request, null, next);
    request.args.should.be.deep.equal(data.expected.adiitionaLClaims);
    next.should.have.been.calledOnce();
    next.getCall(0).args.length.should.equal(0);
  });
  it('success with multienetity', async () => {
    const data = testData.c7;
    verifyStub.withArgs(data.expected.token, data.expected.config.auth).returns(data.claims);
    // identity transformation
    claimsModifierStub.withArgs(data.expected.claims).returns(data.claims);
    const request = Object.assign({}, data.request);
    await authorize(data.config, request, null, next);
    request.args.should.be.deep.equal(data.expected.adiitionaLClaims);
    next.should.have.been.calledOnce();
    next.getCall(0).args.length.should.equal(0);
  });
  it('look ma, no head!', async () => {
    const data = testData.c2;
    const request = Object.assign(requestStub, data.request);
    status.withArgs(401).returns({ json });
    await authorize(data.config, request, { status }, next);
    status.should.have.been.calledOnce();
    status.getCall(0).args[0].should.equal(401);
    next.should.not.have.been.called();
    errorSpy.should.have.been.calledOnce();
  });

  it('no bearer', async () => {
    const data = testData.c3;
    const request = Object.assign(requestStub, data.request);
    status.withArgs(401).returns({ json });
    await authorize(data.config, request, { status }, next);
    status.should.have.been.calledOnce();
    status.getCall(0).args[0].should.equal(401);
    next.should.not.have.been.called();
    errorSpy.should.have.been.calledOnce();
  });

  it('some token problem', async () => {
    const data = testData.c4;
    const request = Object.assign(requestStub, data.request);
    verifyStub.withArgs(data.expected.token, data.expected.config.auth).throws(
      createVError(data.verror.name, data.verror.message));
    status.withArgs(401).returns({ json });

    await authorize(data.config, request, { status }, next);
    status.should.have.been.calledOnce();
    status.getCall(0).args[0].should.equal(401);
    next.should.not.have.been.called();
    errorSpy.should.have.been.calledOnce();
  });

  it('expired token', async () => {
    const data = testData.c5;
    const request = Object.assign(requestStub, data.request);
    verifyStub.withArgs(data.expected.token, data.expected.config.auth).throws(
      createVError(data.verror.name, data.verror.message));
    status.withArgs(401).returns({ json });

    await authorize(data.config, request, { status }, next);
    status.should.have.been.calledOnce();
    status.getCall(0).args[0].should.equal(401);
    next.should.not.have.been.called();
    errorSpy.should.have.been.calledOnce();
  });

  it('runtime error', async () => {
    const data = testData.c6;
    const request = Object.assign(requestStub, data.request);
    verifyStub.withArgs(data.expected.token, data.expected.config.auth).throws(
      createVError(data.verror.name, data.verror.message));
    status.withArgs(500).returns({ json });
    await authorize(data.config, request, { status }, next);
    status.should.have.been.calledOnce();
    status.getCall(0).args[0].should.equal(500);
    next.should.not.have.been.called();
    errorSpy.should.have.been.calledOnce();
  });
});
