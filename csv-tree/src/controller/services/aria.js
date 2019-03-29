const rp = require('request-promise');
const fs = require('fs');
const UUID = require('uuid/v4');

const keyPath = `${__dirname}/../certs/billing-key.key`;
const certPath = `${__dirname}/../certs/billing-cert.crt`;
let ARIA_URL;


class aria {
  constructor() {
    ARIA_URL = process.env.ARIA_URL || 'https://b2b-agilebiller-sit.np.in.telstra.com.au';
    this.baseARIAOptions = {
      cert: fs.readFileSync(certPath, 'UTF-8'),
      key: fs.readFileSync(keyPath, 'UTF-8'),
    };
  }

  getLatestInvoiceData(accountId, type, token) {
    const requestOptions = {
      method: 'GET',
      uri: `${ARIA_URL}/invoice/generateInvoiceData?customerAccountNumber=${accountId}`,
      headers: {
        'Content-Type': `application/${type}`,
        Authorization: token,
        CorrelationId: UUID(),
      },
      ...this.baseARIAOptions,
      requestCert: true,
      json: true,
      rejectUnauthorized: false,
    };
    return rp(requestOptions);
  }

  getInvoiceData(accountId, invoiceNumber, type, token) {
    const requestOptions = {
      method: 'POST',
      uri: `${ARIA_URL}/invoice/v2/generateInvoiceDataByInvoiceNumber`,
      headers: {
        'Content-Type': 'application/json',
        Accept: `application/${type}`,
        Authorization: token,
        CorrelationId: UUID(),
      },
      body: {
        customerAccountNumber: accountId,
        invoiceNumber,
      },
      ...this.baseARIAOptions,
      json: true,
      requestCert: true,
      rejectUnauthorized: false,
    };
    return rp(requestOptions);
  }
  getInvoiceDataPdf(accountId, invoiceNumber, type, token) {
    const requestOptions = {
      method: 'POST',
      encoding: null,
      uri: `${ARIA_URL}/invoice/generateInvoiceDataByInvoiceNumber`,
      headers: {
        'Content-Type': 'application/json',
        Accept: `application/${type}`,
        Authorization: token,
        CorrelationId: UUID(),
      },
      body: {
        customerAccountNumber: accountId,
        invoiceNumber,
      },
      ...this.baseARIAOptions,
      json: true,
      requestCert: true,
      rejectUnauthorized: false,
    };
    return rp(requestOptions);
  }
  getAllInvoices(accountId, token) {
    const requestOptions = {
      method: 'GET',
      uri: `${ARIA_URL}/invoice/v1/generateInvoiceData/all?customerAccountNumber=${accountId}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        CorrelationId: UUID(),

      },
      ...this.baseARIAOptions,
      json: true,
      requestCert: true,
      rejectUnauthorized: false,
    };
    return rp(requestOptions);
  }
}
module.exports = aria;
