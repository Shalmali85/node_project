const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const proxyquire = require('proxyquire');
const chai = require('chai');
const dirtyChai = require('dirty-chai');
const mocha = require('mocha');

chai.should();

const sandbox = sinon.sandbox.create();
chai.use(sinonChai);
chai.use(dirtyChai);

const {
  it,
  describe,
  beforeEach,
  afterEach,
} = mocha;

class Stub {
  getConfig() { return this; }

  init() { return this; }

  param() { return this; }

  use() { return this; }

  authorize() { return this; }
}

const testData = require('./server.testdata.json');

const requireSpy = require('require-spy');

describe('server', () => {
  let router;
  let configSpy;
  let initSpy;
  let newRelicStub;
  let useSpy;
  let paramSpy;
  let authSpy;

  beforeEach(() => {
    router = sandbox.stub();
    configSpy = sandbox.spy(Stub.prototype, 'getConfig');
    initSpy = sandbox.spy(Stub.prototype, 'init');
    authSpy = sandbox.spy(Stub.prototype, 'authorize');
    useSpy = sandbox.spy(Stub.prototype, 'use');
    paramSpy = sandbox.spy(Stub.prototype, 'param');
    newRelicStub = sandbox.stub();
    requireSpy.start();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('start', () => {
    const data = testData.c1;
    router.withArgs().returns(new Stub());

    proxyquire('../server', {
      newrelic: newRelicStub,
      'ms-router': router,
      './src/init': data.args.init,
    });
    requireSpy.check('newrelic').should.equal(true);
    configSpy.should.have.been.calledOnce();
    initSpy.should.have.been.calledOnce();
    initSpy.getCall(0).args[0].should.deep.equal(data.expected.init);
    useSpy.should.have.been.calledTwice();
    authSpy.should.have.been.calledOnce();
    authSpy.getCall(0).args[0].should.be.a(data.expected.authorize.type);
    paramSpy.should.have.been.calledOnce();
  });

  describe('with cache-control', () => {
    let cacheControlSpy;
    beforeEach(() => {
      cacheControlSpy = sandbox.spy();
    });

    afterEach(() => {
      delete process.env.CACHE_CONTROL_ENABLED;
      delete process.env.CACHE_CONTROL;
    });

    it('should load middleware', () => {
      const data = testData.c1;
      router.withArgs().returns(new Stub());
      process.env.CACHE_CONTROL_ENABLED = 'true';
      console.log(process.env.CACHE_CONTROL_ENABLED);
      console.log(typeof process.env.CACHE_CONTROL_ENABLED);

      proxyquire('../server', {
        newrelic: newRelicStub,
        'ms-router': router,
        './src/init': data.args.init,
        './src/middleware/cache-control': cacheControlSpy,
      });
      requireSpy.check('newrelic').should.equal(true);
      configSpy.should.have.been.calledOnce();
      initSpy.should.have.been.calledOnce();
      initSpy.getCall(0).args[0].should.deep.equal(data.expected.init);
      useSpy.should.have.been.calledTwice();
      useSpy.should.have.been.calledWith(cacheControlSpy);
      authSpy.should.have.been.calledOnce();
      authSpy.getCall(0).args[0].should.be.a(data.expected.authorize.type);

      paramSpy.should.have.been.calledOnce();
    });

    it('should not load middleware', () => {
      const data = testData.c1;
      router.withArgs().returns(new Stub());
      process.env.CACHE_CONTROL_ENABLED = 'false';
      console.log(process.env.CACHE_CONTROL_ENABLED);
      console.log(typeof process.env.CACHE_CONTROL_ENABLED);

      proxyquire('../server', {
        newrelic: newRelicStub,
        'ms-router': router,
        './src/init': data.args.init,
        './src/middleware/cache-control': cacheControlSpy,
      });
      requireSpy.check('newrelic').should.equal(true);
      configSpy.should.have.been.calledOnce();
      initSpy.should.have.been.calledOnce();
      initSpy.getCall(0).args[0].should.deep.equal(data.expected.init);
      useSpy.should.not.have.been.calledTwice();
      useSpy.should.not.have.been.calledWith(cacheControlSpy);
      authSpy.should.have.been.calledOnce();
      authSpy.getCall(0).args[0].should.be.a(data.expected.authorize.type);
      paramSpy.should.have.been.calledOnce();
    });
  });
});
