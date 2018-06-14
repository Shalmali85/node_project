const mocha = require('mocha');
const chai = require('chai');
const sinon = require('sinon');
const CfNodejsClient = require('cf-nodejs-client');
const service = require('../../src/shared/discover-service.js');
const expect = chai.expect();

chai.should();

const sandbox = sinon.sandbox.create();

describe('Service Discovery test', () => {
  let serviceStub;

  function setupServiceStubs() {
    serviceStub.getInfo = sandbox.stub(CfNodejsClient.prototype, 'getInfo');
  }


  beforeEach(() => {
    serviceStub = sandbox.spy(() => new CfNodejsClient());
    setupServiceStubs();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should return a list with matching services for a pattern', (done) => {
    const map = new Map('role:test', { name: test, url: 'test.cfapps.io' });
      serviceStub.getInfo.resolves({ name: 'test', url: 'test.cfapps.io' });
    const result = service.discover([{ pin: 'role:test' }], { domain: 'mockUrl', name: '***', password: '***' },
      (err, response) => {
        expect(response).to.be.equal(map);
      });
  });
});
