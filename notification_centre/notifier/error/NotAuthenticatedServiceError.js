'use strict';
const ServiceError = require('./ServiceError.js');

class NotAuthenticatedServiceError extends ServiceError {
  constructor() {
    super(401, 401, 'Unauthorized');
  }
}

module.exports = NotAuthenticatedServiceError;
