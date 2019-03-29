const ServiceError = require('tc-utilities/error/ServiceError');


function handleError(error, message) {
  console.log(error.error);
  if (error.error) {
    const errorMessage = error.error.toString('utf8');
    console.log(errorMessage);
    const result = message[errorMessage];
    if (result) {
      return new ServiceError('422', result.type, result.message);
    }
    if (error.error.code === 'ENOTFOUND' || error.error.code === 'ETIMEDOUT') {
      return new ServiceError('504', error.error.code, error.error.code === 'ENOTFOUND' ? 'Cannot establish connection with server' : 'No response from server');
    }
  }
  return error;
}

function handleAccountsError(error, accountId, accountList, message) {
  console.log(error.error);
  if (error.error) {
    const errorMessage = error.error.toString('utf8');
    console.log(errorMessage);
    const result = message[errorMessage];
    if (result) {
      accountList.push({ isSuccess: false,
        billingAccountId: accountId,
        errorMessage: result.message });
      return accountList;
    }
  }
  const genericError = new ServiceError('500', 'B500', 'Internal Server Error');
  return genericError;
}

function handleBillingError(error, message) {
  const errorMessage = error.error;
  console.log(error);
  if (errorMessage && (errorMessage.code === 'ENOTFOUND' || errorMessage.code === 'ETIMEDOUT')) {
    return new ServiceError('504', errorMessage.code, errorMessage.code === 'ENOTFOUND' ? 'Cannot establish connection with server' : 'No response from Server');
  }
  if (errorMessage && errorMessage.errors && errorMessage.errors[0].message) {
    const result = message[errorMessage.errors[0].message];
    if (result) {
      return new ServiceError('422', result.type, result.message);
    }
    const exception =
            new ServiceError(`${errorMessage.code}`, `B${errorMessage.status}`, errorMessage.errors[0].message);
    return exception;
  }
  return error;
}
module.exports = { handleError, handleAccountsError, handleBillingError };
