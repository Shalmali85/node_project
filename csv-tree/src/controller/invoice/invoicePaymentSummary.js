/* eslint-disable no-param-reassign */
const BillingServices = require('../services/billingServices');
const ServiceError = require('tc-utilities/error/ServiceError');

const moment = require('moment');

function parsePaymentdata(paymentSummary, args) {
  const accountInvoicePayments = {};
  accountInvoicePayments.billingAccountNumber = args.accountId;

  if (paymentSummary.invoices && paymentSummary.invoices.length > 0
      && paymentSummary.invoices[0].invoiceNumber) {
    accountInvoicePayments.invoiceNumber = paymentSummary.invoices[0].invoiceNumber.toString();
    accountInvoicePayments.payments = [];
    if (paymentSummary.invoices[0].payments && paymentSummary.invoices[0].payments.length > 0) {
      accountInvoicePayments.totalPaymentReceived =
                paymentSummary.invoices[0].payments.reduce((total, payment) => {
                  payment.date = payment.date ? moment(payment.date, 'DD/MM/YYYY').format('YYYY-MM-DDTHH:mm:ss') : '';
                  accountInvoicePayments.payments.push({ amount: payment.amount, date: payment.date });
                  return total + payment.amount;
                }, 0);
    }
  }
  if (!accountInvoicePayments.payments) {
    accountInvoicePayments.invoiceNumber = args.invoiceNumber;
    accountInvoicePayments.payments = [];
  }
  return accountInvoicePayments;
}

function invoicePaymentSummary(args) {
  const accountId = args.accountId.trim();
  const invoiceNumber = args.invoiceNumber;
  const token = args.bds_token;
  if (!args.invoiceNumber) {
    throw new ServiceError('400', 'B400', 'Invoice Number is mandatory');
  }
  const billingServices = new BillingServices();

  return billingServices.getAccountInvoicePayment(accountId, invoiceNumber, token)
    .then(paymentSummary => parsePaymentdata(paymentSummary, args));
}

module.exports = invoicePaymentSummary;
