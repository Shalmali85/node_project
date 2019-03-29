const sinon = require('sinon');
const chai = require('chai');
const testData = require('./get.testdata.json');
chai.should();

const myRequire = require;

describe('get health', () => {

  it('ok', (done) => {
    const data = testData.c1;
    const target = myRequire('../../../../src/controller/management/health/get').handler;

    data.reply = {
      sendJson: sinon.stub().callsFake((acknowledgement, code) => {
        done();
        acknowledgement.should.deep.equal(data.expected.payload);
        code.should.equal(data.expected.statusCode);
      })
    };

    target(data.request, data.reply);
  });
});
