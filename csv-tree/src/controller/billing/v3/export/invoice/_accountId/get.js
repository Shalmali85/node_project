const exportInvoiceDetails = require('../../../../../invoice/exportInvoiceDetails');
const formatError = require('../../../../../shared/formatError');

let config;

module.exports = {
  init: (cfg) => { config = cfg; },
  handler: async (request, reply) => {
    try {
      const response = await exportInvoiceDetails(config, {
        ...request.query,
        ...request.params,
        ...request.args,
      });
      reply.header('content-type', 'text/csv');
      return reply.send(response, 200);
    } catch (error) {
      console.log(error);
      const formattedError = formatError(error);
      return reply.sendJson(formattedError, formattedError.status);
    }
  },
};
