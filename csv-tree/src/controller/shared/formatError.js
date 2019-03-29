const ServiceError = require('tc-utilities/error/ServiceError');


module.exports = function formatError(error) {
  if (error instanceof ServiceError) {
    return ({ status: error.status, code: error.code, message: error.customMessage });
  }
  return ({ status: '500', code: 'B500', message: 'Internal Server Error' });
};
