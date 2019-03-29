/* eslint-disable no-param-reassign */
const BillingServices = require('../services/billingServices');

const moment = require('moment');

function parseTransactionData(transactionSummary, args) {
  const accountTransactions = {};
  accountTransactions.billingAccountNumber = args.accountId;
  accountTransactions.transactions = [];
  if (!args.transactionId && transactionSummary.payments) {
    transactionSummary.payments.forEach((payment) => {
      if (payment.transactionId) {
        const transaction = {};
        transaction.transactionId = payment.transactionId.toString();
        transaction.dateReceived = payment.paymentDate ? moment(payment.paymentDate, 'DD/MM/YYYY').format('YYYY-MM-DDTHH:mm:ss') : '';
        transaction.amountReceived = payment.paymentAmount;
        transaction.amountApplied = payment.paymentAmount - payment.paymentUnappliedAmount;
        transaction.amountCredited = payment.paymentUnappliedAmount;
        accountTransactions.transactions.push(transaction);
      }
    });
  }
  if (args.transactionId && transactionSummary.payments && transactionSummary.payments.length > 0
      && transactionSummary.payments[0].transactionId) {
    accountTransactions.transactionId = transactionSummary.payments[0].transactionId.toString();
    accountTransactions.dateReceived = transactionSummary.payments[0].paymentDate ? moment(transactionSummary.payments[0].paymentDate, 'DD/MM/YYYY').format('YYYY-MM-DDTHH:mm:ss') : '';
    accountTransactions.amountReceived = transactionSummary.payments[0].paymentAmount;
    accountTransactions.amountCredited = transactionSummary.payments[0].paymentUnappliedAmount;
    accountTransactions.invoices = [];
    accountTransactions.totalAmountApplied = 0;
    transactionSummary.payments[0].paymentApplicationDetails.forEach((payment) => {
      const invoice = {};
      if (payment.invoiceNumber) {
        invoice.invoiceNumber = payment.invoiceNumber.toString();
        invoice.amountApplied = payment.amountApplied;
        accountTransactions.totalAmountApplied += payment.amountApplied;
        accountTransactions.invoices.push(invoice);
      }
    });
    delete accountTransactions.transactions;
  }
  return accountTransactions;
}

function getAccountTransactions(args) {
  const accountId = args.accountId.trim();
  const transactionId = args.transactionId;
  const token = args.bds_token;
  const billingServices = new BillingServices();
  return billingServices.getTransactionDetails(accountId, token, transactionId)
    .then(transactionSummary => parseTransactionData(transactionSummary, args));
}

module.exports = getAccountTransactions;
