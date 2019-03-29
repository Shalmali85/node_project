const chai = require('chai');
const sinonChai = require('sinon-chai');
const dirtyChai = require('dirty-chai');
const formatError = require('../../../src/controller/shared/formatError');
const ServiceError = require('tc-utilities/error/ServiceError');

const should = chai.should();

chai.use(sinonChai);
chai.use(dirtyChai);


describe('format Errors Error scenarios', () => {
  it('should return error 404 if account or invoice does not exist', () => {
    const genericError = new ServiceError('404', 'B404', 'Account does not exist');
    const result = formatError(genericError);
    result.status.should.be.deep.equal('404');
  });

  it('should return error 500 if no connection found', () => {
    const error = new Error('address not found');
    const result = formatError(error);
    result.status.should.be.deep.equal('500');
  });
});

