const proxyquire = require('proxyquire');
const rp = require('request-promise');
const chai = require('chai');
const sinon = require('sinon');
const testData = require('./init.test.data.json');

const { expect } = chai;
const { stub } = sinon;

describe('Initialization process', () => {
  it('should stub auth call and return static json for development', (done) => {
    process.env.NODE_ENV = 'test';
    const initStub = { './db/connection': { addCouchbaseConnection: stub().callsFake(() => null) } };
    const { data, expected } = testData.c1;

    const target = proxyquire('../src/init', initStub);
    target(data);

    rp(data.url)
      .then((res) => {
        expect(JSON.parse(res)).to.deep.equal(expected);
        done();
      })
      .catch(reason => done(reason));
  });

  it('should stub auth call and return static json for development on cloud profile', (done) => {
    process.env.NODE_ENV = 'cloud';
    const initStub = { './db/connection': { addCouchbaseConnection: stub().callsFake(() => null) } };
    const { data, expected } = testData.c1;

    const target = proxyquire('../src/init', initStub);
    target(data);

    rp(data.url)
      .then((res) => {
        expect(JSON.parse(res)).to.deep.equal(expected);
        done();
      })
      .catch(reason => done(reason));
  });
});
