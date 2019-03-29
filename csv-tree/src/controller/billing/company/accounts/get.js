const getCidnAccounts = require('../../../invoice/getCidnAccounts');
const formatError = require('../../../shared/formatError');
const { handleBillingError } = require('../../../shared/errorHandler');

let config;

module.exports = {
  init: (cfg) => { config = cfg; },
  handler: async (request, reply) => {
    try {
      const response = await getCidnAccounts(config, {
        ...request.query,
        ...request.params,
        ...request.args,
      });
      return reply.sendJson(response, 200);
    } catch (error) {
      console.log(error);
      const formattedError = formatError(handleBillingError(error, config.billing.errorMessages));
      return reply.sendJson(formattedError, formattedError.status);
    }
  },
};
