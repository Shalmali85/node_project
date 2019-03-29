const rp = require('request-promise');
const fs = require('fs');
const ServiceError = require('tc-utilities/error/ServiceError');

const keyPath = `${__dirname}/../certs/bds-key.key`;
const certPath = `${__dirname}/../certs/bds-cert.crt`;
const UUID = require('uuid/v4');

let BILLING_URL;

class billingServices {
  constructor() {
    BILLING_URL = process.env.BDS_URL || 'https://slot1.org009.t-dev.telstra.net/application/b2b-bds-sit/v2.0/billing-accounts';
    this.baseBillingServicesOptions = {
      cert: fs.readFileSync(certPath, 'UTF-8'),
      key: fs.readFileSync(keyPath, 'UTF-8'),
    };
  }


  generateToken(config) {
    if (!config) {
      return Promise.reject(new ServiceError('400', 'B400', 'Client configuration missing'));
    }
    const requestOptions = {
      method: 'POST',
      uri: config.bds.bds_token_url,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      form: {
        client_id: config.bds.bds_client_id,
        client_secret: config.bds.bds_client_secret,
        grant_type: config.bds.bds_grant_type,
      },
      ...this.baseBillingServicesOptions,
      requestCert: true,
      rejectUnauthorized: false,
      json: true,
    };
    return rp(requestOptions);
  }


  getAccountInvoicePayment(accountNumber,
    invoiceNumber, token) {
    const requestOptions = {
      method: 'GET',
      uri: `${BILLING_URL}/${accountNumber}/invoices/${invoiceNumber}/payments`,
      headers: {
        'Source-System': 'TConnect',
        'Correlation-Id': UUID(),
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      ...this.baseBillingServicesOptions,
      requestCert: true,
      rejectUnauthorized: false,
      json: true,
    };
    return rp(requestOptions);
  }

  getAccountNumbers(company, token) {
    const requestOptions = {
      method: 'GET',
      uri: `${BILLING_URL}/customers-relationships/${company}`,
      headers: {
        'Source-System': 'TConnect',
        'Correlation-Id': UUID(),
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      ...this.baseBillingServicesOptions,
      requestCert: true,
      rejectUnauthorized: false,
      json: true,
    };
    return rp(requestOptions);
  }

  getTransactionDetails(accountNumber,
    token, transactionId, startDate, endDate) {
    let optionalParameter = null;
    if (transactionId) {
      optionalParameter = `?transactionId=${transactionId}`;
    }
    if (startDate && endDate) {
      optionalParameter = optionalParameter ? `?startDate=${startDate}&endDate= ${endDate}` : `&startDate=${startDate}&endDate= ${endDate}`;
    }
    const requestOptions = {
      method: 'GET',
      uri: optionalParameter ? `${BILLING_URL}/${accountNumber}/payments${optionalParameter}` : `${BILLING_URL}/${accountNumber}/payments`,
      headers: {
        'Source-System': 'TConnect',
        'Correlation-Id': UUID(),
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      ...this.baseBillingServicesOptions,
      requestCert: true,
      rejectUnauthorized: false,
      json: true,
    };
    return rp(requestOptions);
  }
}
module.exports = billingServices;
