const { it, describe, beforeEach, afterEach } = require('mocha');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const dirtyChai = require('dirty-chai');
const cacheControl = require('../../src/middleware/cache-control');

const should = chai.should();
chai.use(sinonChai);
chai.use(dirtyChai);

const sandbox = sinon.sandbox.create();
describe('Cache Control Middleware', () => {
  let headerStub;
  let nextSpy;
  beforeEach(() => {
    headerStub = sandbox.stub();
    nextSpy = sandbox.spy();
  });

  afterEach(() => {
    sandbox.restore();
    delete process.env.CACHE_CONTROL;
  });

  it('should call header method with Cache-Control and value from environment', () => {
    process.env.CACHE_CONTROL = 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0';
    cacheControl(null, { header: headerStub }, nextSpy);
    headerStub.should.have.been.calledOnce();
    headerStub.should.have.been.calledWith('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    nextSpy.should.have.been.calledOnce();
  });
});
