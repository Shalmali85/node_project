const chai = require('chai');
const sinonChai = require('sinon-chai');
const dirtyChai = require('dirty-chai');
const sinon = require('sinon');
const sinonStubPromise = require('tc-sinon-stub-promise');
const proxyquire = require('proxyquire');
const ServiceError = require('tc-utilities/error/ServiceError');

const should = chai.should();

chai.use(sinonChai);
chai.use(dirtyChai);
sinonStubPromise(sinon);
const message = {
  'account does not exist': { type: 'G422', message: 'Account does not exist' },
  'No statement sequence id is generated for this client account id': { type: 'C422', message: 'Currently no invoices are available for this account' },
  'No billing accounts available': { type: 'G422', message: 'No billing accounts available' },
  'The requested CIDN does not exist in SFDC': { type: 'C422', message: 'No accounts available to view' },

};

describe('get Error scenarios', () => {
  const { handleError } = proxyquire('../../../src/controller/shared/errorHandler.js', {});

  it('should return error 422 if account or invoice does not exist', () => {
    const error = { error: 'account does not exist' };
    const result = handleError(error, message);
    result.status.should.be.deep.equal('422');
  });
  it('should return error if cannot parse error', () => {
    const error = { error: 'undefined' };
    const result = handleError(error, message);
    result.should.be.deep.equal(error);
  });

  it('should return error 504 if no connection found', () => {
    const error = { error: { status: 404, code: 'ENOTFOUND' } };
    const result = handleError(error, message);
    result.status.should.be.deep.equal('504');
  });
  it('should return error 504 if no response from server', () => {
    const error = { error: { status: 404, code: 'ETIMEDOUT' } };
    const result = handleError(error, message);
    result.status.should.be.deep.equal('504');
  });
  it('should return error 500 if some error occur', () => {
    const error = new Error('address not found');
    const result = handleError(error, message);
    result.should.be.instanceOf(Error);
  });
});
describe('get Error scenarios for multiple Accounts', () => {
  const { handleAccountsError } = proxyquire('../../../src/controller/shared/errorHandler.js', {});

  it('should return valid json   if account or invoice does not exist', () => {
    const error = { error: 'account does not exist' };
    const result = handleAccountsError(error, 70000, [], message);
    result.should.be.deep.equal([{ isSuccess: false, billingAccountId: 70000, errorMessage: 'Account does not exist' }]);
  });

  it('should return error 500 if no connection found', () => {
    const result = handleAccountsError(new Error('address not found'), 70000, [], message);
    result.status.should.be.deep.equal('500');
  });

  it('should return error 500 if no connection found', () => {
    const error = { error: 'address not found' };
    const result = handleAccountsError(error, 70000, [], message);
    result.status.should.be.deep.equal('500');
  });
});

describe('get Error scenarios for account invoice payments', () => {
  const { handleBillingError } = proxyquire('../../../src/controller/shared/errorHandler.js', {});

  it('should return valid json   if account or invoice does not exist', () => {
    const error = { error: { code: 422, status: 422, message: 'Validation Failed', errors: [{ code: 1003, field: 'invoiceNumber', message: 'invoiceNumber is invalid' }], correlationId: '54cd34d4-ca51-4945-bc52-9d2917d70a7b' } };
    const result = handleBillingError(error, message);
    result.status.should.be.deep.equal('422');
  });

  it('should return valid json   if account or invoice does not exist', () => {
    const error = { error: { code: 422, status: 422, message: 'Validation Failed', errors: [{ code: 1003, field: 'company', message: 'The requested CIDN does not exist in SFDC' }], correlationId: '54cd34d4-ca51-4945-bc52-9d2917d70a7b' } };
    const result = handleBillingError(error, message);
    result.status.should.be.deep.equal('422');
  });
  it('should return error 504 if no connection found', () => {
    const error = { error: { status: 404, code: 'ENOTFOUND' } };
    const result = handleBillingError(error, message);
    result.status.should.be.deep.equal('504');
  });
  it('should return error 504 if no response  received', () => {
    const error = { error: { status: 404, code: 'ETIMEDOUT' } };
    const result = handleBillingError(error, message);
    result.status.should.be.deep.equal('504');
  });
  it('should return error 500 if some error occurs', () => {
    const result = handleBillingError(new Error('address not found'), message);
    result.should.be.instanceOf(Error);
  });
});
