'use strict';
class ServiceError extends Error {
  constructor(status = 500, code = '', message = '', errors = []) {
    super(message);
    this.status = status;
    this.code = code;
    this.customMessage = message;
    this.errors = errors;
  }

  addError(code, message) {
    const error = {
      code,
      message,
    };
    this.errors.push(error);
    return this;
  }
}

module.exports = ServiceError;
