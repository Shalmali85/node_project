const chai = require('chai');
const sinonChai = require('sinon-chai');
const dirtyChai = require('dirty-chai');
const sinon = require('sinon');
const sinonStubPromise = require('tc-sinon-stub-promise');
const proxyquire = require('proxyquire');
const testData = require('./aria.testdata.json');

sinonStubPromise(sinon);
chai.should();
chai.use(sinonChai);
chai.use(dirtyChai);

const sandbox = sinon.sandbox.create();

describe('Successful Authorized Aria', () => {
  let readFileSyncStub;
  let rpStub;
  let Aria;
  beforeEach(() => {
    readFileSyncStub = sandbox.stub();
    rpStub = sandbox.stub();
    sandbox.spy(rpStub);
    Aria = proxyquire('../../../../src/controller/old_v2/services/aria.js', {
      'request-promise': rpStub,
      fs: {
        readFileSync: readFileSyncStub,
      },
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getInvoiceData', () => {
    let requestOptions;
    beforeEach(() => {
      requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          customerAccountNumber: '200034767920',
          invoiceNumber: '9900000001164',
        },
        json: true,
        requestCert: true,
        rejectUnauthorized: false,
      };
      rpStub.returnsPromise().resolves(testData.datum);
    });

    it('should return a json reponse', () => {
      readFileSyncStub
        .withArgs(`${__dirname}/../certs/billing-cert.crt`, 'UTF-8').returns('CERT')
        .withArgs(`${__dirname}/../certs/billing-key.key`, 'UTF-8').returns('KEY');

      const aria = new Aria();
      const mockData = testData.datum;

      requestOptions.key = 'KEY';
      requestOptions.cert = 'CERT';
      requestOptions.headers = { 'Content-Type': 'application/json' };
      requestOptions.uri = 'mockUrl';
      requestOptions.requestCert = false;
      rpStub.withArgsPromised(requestOptions).resolves(mockData);

      const response = aria.getInvoiceData('200034767920', '9900000001164', 'json');
      response.should.not.be.null();
      response.then((res) => {
        res.should.not.be.null();
        res.should.be.an('object');
        res.should.be.deep.equal(mockData);
      }).catch(err => err.should.be.instanceOf(Error));
    });
  });
  describe('getInvoiceDataPdf', () => {
    let requestOptions;
    beforeEach(() => {
      requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          customerAccountNumber: '200034767920',
          invoiceNumber: '9900000001164',
        },
        json: true,
        requestCert: true,
        rejectUnauthorized: false,
      };
      rpStub.returnsPromise().resolves('abcd');
    });

    it('should return a json reponse', () => {
      readFileSyncStub
        .withArgs(`${__dirname}/../certs/billing-cert.crt`, 'UTF-8').returns('CERT')
        .withArgs(`${__dirname}/../certs/billing-key.key`, 'UTF-8').returns('KEY');

      const aria = new Aria();
      const mockData = 'abcd';

      requestOptions.key = 'KEY';
      requestOptions.cert = 'CERT';
      requestOptions.headers = { 'Content-Type': 'application/pdf' };
      requestOptions.uri = 'mockUrl';
      requestOptions.requestCert = false;
      rpStub.withArgsPromised(requestOptions).resolves(mockData);

      const response = aria.getInvoiceDataPdf('200034767920', '9900000001164', 'pdf');
      response.should.not.be.null();
      response.then((res) => {
        res.should.not.be.null();
        res.should.be.deep.equal(mockData);
      }).catch(err => err.should.be.instanceOf(Error));
    });
  });

  describe('getLatestInvoiceData', () => {
    let requestOptions;
    beforeEach(() => {
      requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        json: true,
        requestCert: true,
        rejectUnauthorized: false,
      };
      rpStub.returnsPromise().resolves(testData.datum);
    });

    it('should return a json reponse', () => {
      readFileSyncStub
        .withArgs(`${__dirname}/../certs/billing-cert.crt`, 'UTF-8').returns('CERT')
        .withArgs(`${__dirname}/../certs/billing-key.key`, 'UTF-8').returns('KEY');

      const aria = new Aria();
      const mockData = testData.datum;

      requestOptions.key = 'KEY';
      requestOptions.cert = 'CERT';
      requestOptions.headers = { 'Content-Type': 'application/json' };
      requestOptions.uri = 'mockUrl';
      requestOptions.requestCert = false;
      rpStub.withArgsPromised(requestOptions).resolves(mockData);

      const response = aria.getLatestInvoiceData('200034767920', 'json');
      response.should.not.be.null();
      response.then((res) => {
        res.should.not.be.null();
        res.should.be.an('object');
        res.should.be.deep.equal(mockData);
      }).catch(err => err.should.be.instanceOf(Error));
    });

    it('should return a pdf response', () => {
      readFileSyncStub
        .withArgs(`${__dirname}/../certs/billing-cert.crt`, 'UTF-8').returns('CERT')
        .withArgs(`${__dirname}/../certs/billing-key.key`, 'UTF-8').returns('KEY');

      const aria = new Aria();

      requestOptions.key = 'KEY';
      requestOptions.cert = 'CERT';
      requestOptions.headers = { 'Content-Type': 'application/pdf' };
      requestOptions.uri = 'mockUrl';

      rpStub.withArgsPromised(requestOptions).resolves();
      const response = aria.getLatestInvoiceData('200034767920', 'json');

      response.should.not.be.null();
      response.then((res) => {
        res.should.not.be.null();
        res.should.be.an('object');
      }).catch(err => err.should.be.instanceOf(Error));
    });
  });

  describe('getAllInvoices', () => {
    let requestOptions;
    beforeEach(() => {
      requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        json: true,
        requestCert: true,
        rejectUnauthorized: false,
      };
      rpStub.returnsPromise().resolves(testData.data);
    });

    it('should return a json reponse', () => {
      readFileSyncStub
        .withArgs(`${__dirname}/../certs/billing-cert.crt`, 'UTF-8').returns('CERT')
        .withArgs(`${__dirname}/../certs/billing-key.key`, 'UTF-8').returns('KEY');

      const aria = new Aria();
      const mockData = testData.data;

      requestOptions.key = 'KEY';
      requestOptions.cert = 'CERT';
      requestOptions.headers = { 'Content-Type': 'application/json' };
      requestOptions.uri = 'mockUrl';
      requestOptions.requestCert = false;
      rpStub.withArgsPromised(requestOptions).resolves(mockData);

      const response = aria.getAllInvoices('700000008513');
      response.should.not.be.null();
      response.then((res) => {
        res.should.not.be.null();
        res.should.be.an('object');
        res.should.be.deep.equal(mockData);
      }).catch(err => err.should.be.instanceOf(Error));
    });
  });
});
describe('Failed Authorized Aria', () => {
  let readFileSyncStub;
  let rpStub;
  let Aria;
  beforeEach(() => {
    readFileSyncStub = sandbox.stub();
    rpStub = sandbox.stub();
    Aria = proxyquire('../../../../src/controller/old_v2/services/aria.js', {
      'request-promise': rpStub,
      fs: {
        readFileSync: readFileSyncStub,
      },
    });
    rpStub.returnsPromise().rejects(new Error('No acces to the api '));
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getLatestInvoiceData', () => {
    let requestOptions;
    beforeEach(() => {
      requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        json: true,
        requestCert: true,
        rejectUnauthorized: false,
      };
    });

    it('should not return a json reponse', () => {
      readFileSyncStub
        .withArgs(`${__dirname}/../certs/billing-cert.crt`, 'UTF-8').returns('CERT')
        .withArgs(`${__dirname}/../certs/billing-key.key`, 'UTF-8').returns('KEY');

      const aria = new Aria();

      requestOptions.key = 'KEY';
      requestOptions.cert = 'CERT';
      requestOptions.headers = { 'Content-Type': 'application/json' };
      requestOptions.uri = 'mockUrl';

      rpStub.withArgsPromised(requestOptions).rejects(new Error('No acces to the api '));
      const response = aria.getLatestInvoiceData();

      response.then((value) => {
        value.should.be.empty();
      }).catch((err) => {
        err.should.not.be.null;
      });
    });
    it('should not return a json reponse when api fails', (done) => {
      readFileSyncStub
        .withArgs(`${__dirname}/../certs/billing-cert.crt`, 'UTF-8').returns('CERT')
        .withArgs(`${__dirname}/../certs/billing-key.key`, 'UTF-8').returns('KEY');

      const aria = new Aria();

      requestOptions.key = 'KEY';
      requestOptions.cert = 'CERT';
      requestOptions.headers = { 'Content-Type': 'application/json' };
      requestOptions.uri = 'mockUrl';

      rpStub.withArgsPromised(requestOptions).rejects();
      const response = aria.getLatestInvoiceData();

      response.then((value) => {
        value.should.be.empty();
      }).catch((err) => {
        err.should.not.be.null;
        done();
      });
    });
  });
});
