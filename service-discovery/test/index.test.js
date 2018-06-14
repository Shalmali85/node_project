const chai = require('chai');
const sinonChai = require('sinon-chai');
const dirtyChai = require('dirty-chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const testData = require('./billing.testdata.json');
const service = require('../src/discover-service')
const {describe,it}  = mocha;
chai.should();
chai.use(sinonChai);
chai.use(dirtyChai);

const sandbox = sinon.sandbox.create();
const args = {
    accountId: '200034767920',
};
const config = {};
describe('test service discovery middleware', () => {
    let serviceStub;
    let index;
    beforeEach(() => {
        serviceStub = sandbox.spy(() => new service());


        index = proxyquire('../src/index.js', {
            serviceDiscovery: serviceStub,
        });
        serviceStub.discover = sandbox.stub(service.prototype, 'discover');
    });

    afterEach(() => {
        sandbox.restore();
    });


    it('should return a map of services with matching patterns', () => {
        const map =new Map();
        serviceStub.discover.callsFake(function fakeFn() {
            map.set('role:test', {
                host: 'test,cfapps.io',
                port: 443,
                protocol: 'https',
                timeout: 60000
            });
            return map;
        });

        index(config, args, (err, result) => {
            result.should.be.deep.equal(testData.responseData);
        });
    });


});
