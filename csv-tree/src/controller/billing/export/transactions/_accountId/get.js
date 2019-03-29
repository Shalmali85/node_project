const exportAccountTransactions = require('../../../../invoice/exportAccountTransactions');
const formatError = require('../../../../shared/formatError');
const { handleBillingError } = require('../../../../shared/errorHandler');

let config;

module.exports = {
  init: (cfg) => { config = cfg; },
  handler: async (request, reply) => {
    try {
      const response = await exportAccountTransactions({
        ...request.query,
        ...request.params,
        ...request.args,
      });
      reply.header('content-type', 'text/csv');
      return reply.send(response, 200);
    } catch (error) {
      console.log(error);
      const formattedError = formatError(handleBillingError(error, config.billing.errorMessages));
      return reply.sendJson(formattedError, formattedError.status);
    }
  },
};
