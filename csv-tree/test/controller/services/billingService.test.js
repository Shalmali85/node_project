const chai = require('chai');
const sinonChai = require('sinon-chai');
const dirtyChai = require('dirty-chai');
const sinon = require('sinon');
const sinonStubPromise = require('tc-sinon-stub-promise');
const proxyquire = require('proxyquire');
const testData = require('./bds.testdata.json');
const UUID = require('uuid/v4');

sinonStubPromise(sinon);
chai.should();
chai.use(sinonChai);
chai.use(dirtyChai);

const sandbox = sinon.sandbox.create();
const config = {
  bds: {
    bds_token_url: 'mockUrl',
    bds_client_id: 'abcde',
    bds_client_secret: 'secret',
    bds_grant_type: 'client_credentials',

  },
};

describe('Successful BDS response', () => {
  let readFileSyncStub;
  let rpStub;
  let BillingService;
  beforeEach(() => {
    readFileSyncStub = sandbox.stub();
    rpStub = sandbox.stub();
    sandbox.spy(rpStub);
    BillingService = proxyquire('../../../src/controller/services/billingServices.js', {
      'request-promise': rpStub,
      fs: {
        readFileSync: readFileSyncStub,
      },
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('generateToken', () => {
    let requestOptions;
    beforeEach(() => {
      requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',

        },
        json: true,
        requestCert: true,
        rejectUnauthorized: false,
      };
      rpStub.returnsPromise().resolves(testData.token);
    });

    it('should return a bearer token  reponse', () => {
      readFileSyncStub
        .withArgs(`${__dirname}/../certs/svc-bos-payment-services.presit.corp.telstra.com.pem`, 'UTF-8').returns('CERT')
        .withArgs(`${__dirname}/../certs/BILLING-ONLINE-SERVICES-PRESIT.key`, 'UTF-8').returns('KEY');

      const billingService = new BillingService();
      const mockData = testData.token;

      requestOptions.key = 'KEY';
      requestOptions.cert = 'CERT';
      requestOptions.uri = 'mockUrl';
      requestOptions.requestCert = false;
      rpStub.withArgsPromised(requestOptions).resolves(mockData);

      const response = billingService.generateToken(config);
      response.should.not.be.null();
      response.then((res) => {
        res.should.be.deep.equal(mockData);
      }).catch((err)=> err.should.be.instanceOf(Error));
    });
  });

  describe('getBillingData', () => {
    let requestOptions;
    let invoiceTestData;
    beforeEach(() => {
      requestOptions = {
        method: 'GET',
        headers: {
          'Source-System': 'TConnect',
          'Correlation-Id': UUID(),
        },
        json: true,
        requestCert: true,
        rejectUnauthorized: false,
      };
      invoiceTestData = Object.assign({}, testData.data);
      rpStub.returnsPromise().resolves(invoiceTestData);
    });

    it('should return a json reponse with invoice Number ', () => {
      readFileSyncStub
        .withArgs(`${__dirname}/../certs/svc-bos-payment-services.presit.corp.telstra.com.pem`, 'UTF-8').returns('CERT')
        .withArgs(`${__dirname}/../certs/BILLING-ONLINE-SERVICES-PRESIT.key`, 'UTF-8').returns('KEY');

      const billingService = new BillingService();
      const mockData = testData.data;

      requestOptions.key = 'KEY';
      requestOptions.cert = 'CERT';
      requestOptions.uri = 'mockUrl';
      requestOptions.requestCert = false;
      rpStub.withArgsPromised(requestOptions).resolves(mockData);

      const response = billingService.getAccountInvoicePayment(7000965228, 1479432, 'lSwIPGzurEtxvAKhjqjN4L');
      response.should.not.be.null();
      response.then((res) => {
        res.should.be.deep.equal(mockData);
      }).catch((err)=> err.should.be.instanceOf(Error));
    });

  });

  describe('getTransactionData', () => {
    let requestOptions;
    let invoiceTestData;
    beforeEach(() => {
      requestOptions = {
        method: 'GET',
        headers: {
          'Source-System': 'TConnect',
          'Correlation-Id': UUID(),
        },
        json: true,
        requestCert: true,
        rejectUnauthorized: false,
      };
      invoiceTestData = Object.assign({}, testData.data);
      rpStub.returnsPromise().resolves(invoiceTestData);
    });

    it('should return a json reponse with invoice Number ', () => {
      readFileSyncStub
        .withArgs(`${__dirname}/../certs/svc-bos-payment-services.presit.corp.telstra.com.pem`, 'UTF-8').returns('CERT')
        .withArgs(`${__dirname}/../certs/BILLING-ONLINE-SERVICES-PRESIT.key`, 'UTF-8').returns('KEY');

      const billingService = new BillingService();
      const mockData = testData.data;

      requestOptions.key = 'KEY';
      requestOptions.cert = 'CERT';
      requestOptions.uri = 'mockUrl';
      requestOptions.requestCert = false;
      rpStub.withArgsPromised(requestOptions).resolves(mockData);

      const response = billingService.getTransactionDetails(7000965228, 'lSwIPGzurEtxvAKhjqjN4L', 1479432);
      response.should.not.be.null();
      response.then((res) => {
        res.should.be.deep.equal(mockData);
      }).catch((err)=> err.should.be.instanceOf(Error));
    });

    it('should return a json reponse with account Number only  ', () => {
      readFileSyncStub
        .withArgs(`${__dirname}/../certs/svc-bos-payment-services.presit.corp.telstra.com.pem`, 'UTF-8').returns('CERT')
        .withArgs(`${__dirname}/../certs/BILLING-ONLINE-SERVICES-PRESIT.key`, 'UTF-8').returns('KEY');

      const billingService = new BillingService();
      const mockData = testData.data;

      requestOptions.key = 'KEY';
      requestOptions.cert = 'CERT';
      requestOptions.uri = 'mockUrl';
      requestOptions.requestCert = false;
      rpStub.withArgsPromised(requestOptions).resolves(mockData);

      const response = billingService.getTransactionDetails(7000965228, 'lSwIPGzurEtxvAKhjqjN4L');
      response.should.not.be.null();
      response.then((res) => {
        res.should.be.deep.equal(mockData);
      }).catch((err)=> err.should.be.instanceOf(Error));
    });

    it('should return a json reponse with date and account  only  ', () => {
      readFileSyncStub
        .withArgs(`${__dirname}/../certs/svc-bos-payment-services.presit.corp.telstra.com.pem`, 'UTF-8').returns('CERT')
        .withArgs(`${__dirname}/../certs/BILLING-ONLINE-SERVICES-PRESIT.key`, 'UTF-8').returns('KEY');

      const billingService = new BillingService();
      const mockData = testData.data;

      requestOptions.key = 'KEY';
      requestOptions.cert = 'CERT';
      requestOptions.uri = 'mockUrl';
      requestOptions.requestCert = false;
      rpStub.withArgsPromised(requestOptions).resolves(mockData);

      const response = billingService.getTransactionDetails(7000965228, 'lSwIPGzurEtxvAKhjqjN4L', null, '2018-09-25', '2018-10-29');
      response.should.not.be.null();
      response.then((res) => {
        res.should.be.deep.equal(mockData);
      }).catch((err)=> err.should.be.instanceOf(Error));
    });

    it('should return a json reponse with date , transaction and account ', () => {
      readFileSyncStub
        .withArgs(`${__dirname}/../certs/svc-bos-payment-services.presit.corp.telstra.com.pem`, 'UTF-8').returns('CERT')
        .withArgs(`${__dirname}/../certs/BILLING-ONLINE-SERVICES-PRESIT.key`, 'UTF-8').returns('KEY');

      const billingService = new BillingService();
      const mockData = testData.data;

      requestOptions.key = 'KEY';
      requestOptions.cert = 'CERT';
      requestOptions.uri = 'mockUrl';
      requestOptions.requestCert = false;
      rpStub.withArgsPromised(requestOptions).resolves(mockData);

      const response = billingService.getTransactionDetails(7000965228, 'lSwIPGzurEtxvAKhjqjN4L', '1479432', '2018-09-25', '2018-10-29');
      response.should.not.be.null();
      response.then((res) => {
        res.should.be.deep.equal(mockData);
      }).catch((err)=> err.should.be.instanceOf(Error));
    })
  });


  describe('getBillingData for company account', () => {
    let requestOptions;
    let invoiceTestData;
    beforeEach(() => {
      requestOptions = {
        method: 'GET',
        headers: {
          'Source-System': 'TConnect',
          'Correlation-Id': UUID(),
        },
        json: true,
        requestCert: true,
        rejectUnauthorized: false,
      };
      invoiceTestData = Object.assign({}, testData.accounts);
      rpStub.returnsPromise().resolves(invoiceTestData);
    });
    it('should return a list of account  with company name only   ', () => {
      readFileSyncStub
        .withArgs(`${__dirname}/../certs/svc-bos-payment-services.presit.corp.telstra.com.pem`, 'UTF-8').returns('CERT')
        .withArgs(`${__dirname}/../certs/BILLING-ONLINE-SERVICES-PRESIT.key`, 'UTF-8').returns('KEY');

      const billingService = new BillingService();
      const mockData = testData.accounts;

      requestOptions.key = 'KEY';
      requestOptions.cert = 'CERT';
      requestOptions.uri = 'mockUrl';
      requestOptions.requestCert = false;
      rpStub.withArgsPromised(requestOptions).resolves(mockData);

      const response = billingService.getAccountNumbers(15054, 'lSwIPGzurEtxvAKhjqjN4L');
      response.should.not.be.null();
      response.then((res) => {
        res.should.be.deep.equal(mockData);
      }).catch((err)=> err.should.be.instanceOf(Error));
    });
  });
});


describe('Failed BDS', () => {
  let readFileSyncStub;
  let rpStub;
  let BillingService;
  beforeEach(() => {
    readFileSyncStub = sandbox.stub();
    rpStub = sandbox.stub();
    BillingService = proxyquire('../../../src/controller/services/billingServices.js', {
      'request-promise': rpStub,
      fs: {
        readFileSync: readFileSyncStub,
      },
    });
    rpStub.returnsPromise().rejects(new Error('Address not found'));
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getPaymentData', () => {
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

    it('should  return an exception ', () => {
      readFileSyncStub
        .withArgs(`${__dirname}/../certs/svc-bos-payment-services.presit.corp.telstra.com.pem`, 'UTF-8').returns('CERT')
        .withArgs(`${__dirname}/../certs/BILLING-ONLINE-SERVICES-PRESIT.key`, 'UTF-8').returns('KEY');

      const billingService = new BillingService();

      requestOptions.key = 'KEY';
      requestOptions.cert = 'CERT';
      requestOptions.uri = 'mockUrl';

      rpStub.withArgsPromised(requestOptions).rejects(new Error('Address not found'));
      const response = billingService.getAccountInvoicePayment(14955, 90014, 'lSwIPGzurEtxvAKhjqjN4L');


      response.then((value) => {
        value.should.be.empty();
      }).catch((err) => {
        err.should.not.be.null;
      });
    });
  });

  describe('generateTokenFailure', () => {
    let requestOptions;
    beforeEach(() => {
      requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',

        },
        json: true,
        requestCert: true,
        rejectUnauthorized: false,
      };
    });

    it('should return an exception  when config parameters are missing', () => {
      readFileSyncStub
        .withArgs(`${__dirname}/../certs/svc-bos-payment-services.presit.corp.telstra.com.pem`, 'UTF-8').returns('CERT')
        .withArgs(`${__dirname}/../certs/BILLING-ONLINE-SERVICES-PRESIT.key`, 'UTF-8').returns('KEY');

      const billingService = new BillingService();

      requestOptions.key = 'KEY';
      requestOptions.cert = 'CERT';
      requestOptions.uri = 'mockUrl';
      requestOptions.requestCert = false;
      rpStub.withArgsPromised(requestOptions).rejects(new Error('Client configuration missing'));

      const response = billingService.generateToken(null);
      response.should.not.be.null();
      response.then((value) => {
        value.should.be.empty();
      }).catch((err) => {
        err.should.not.be.null;
      });
    });
  });
});

