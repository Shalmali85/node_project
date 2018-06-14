const chai = require('chai');
const sinon = require('sinon');
const CfNodejsClient = require('cf-nodejs-client');
const data = require('./cf.test.json');
const service = require('../src/discover-service.js');

const expect = chai.expect;

chai.should();

const sandbox = sinon.sandbox.create();

describe('Service Discovery test', () => {
  let cloudControllerStub;
  let usersUAAStub;
  let appStub;

  function setupServiceStubs() {
    cloudControllerStub.getInfo = sandbox.stub(CfNodejsClient.CloudController.prototype, 'getInfo');
    usersUAAStub.login = sandbox.stub(CfNodejsClient.UsersUAA.prototype, 'login');
    appStub.getApps = sandbox.stub(CfNodejsClient.Apps.prototype, 'getApps');
    appStub.getEnvironmentVariables = sandbox.stub(CfNodejsClient.Apps.prototype, 'getEnvironmentVariables');
  }


  beforeEach(() => {
    cloudControllerStub = sandbox.spy(() => new CfNodejsClient.CloudController('mockUrl'));
    usersUAAStub = sandbox.spy(() => new CfNodejsClient.UsersUAA());
    appStub = sandbox.spy(() => new CfNodejsClient.Apps('mockUrl'));
    setupServiceStubs();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should return a map with matching services for a pattern', () => {
    cloudControllerStub.getInfo.resolves(data.cfData.infoData);
    usersUAAStub.login.resolves(data.cfData.loginData);
    appStub.getApps.resolves(data.cfData.appData);
    appStub.getEnvironmentVariables.resolves(data.cfData.vcapData[0]);
    service.discover([{ pin: 'role:test' }], { domain: 'mockUrl', name: '*', password: '*' },
      (err, response) => {
        expect(response).to.be.a('Map');
      });
  });

  it('should return a map when no pin exist ', () => {
    cloudControllerStub.getInfo.resolves(data.cfData.infoData);
    usersUAAStub.login.resolves(data.cfData.loginData);
    appStub.getApps.resolves(data.cfData.appData);
    appStub.getEnvironmentVariables.resolves(data.cfData.vcapData[0]);
    service.discover([{invalidPin: 'role:test'}], { domain: 'mockUrl', name: '*', password: '*' },
      (err, response) => {
        expect(response).to.be.a('Map');
      });
  });

  it('should return an exception  on invalid Url', () => {
    cloudControllerStub.getInfo.rejects(new Error('Invalid Url'));
    service.discover([{ pin: 'role:test' }], { domain: 'invalid', name: '*', password: '*' },
      (err, response) => {
        expect(err).to.be.instanceOf(Error);
      });
  });
});
