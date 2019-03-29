const auth = require('@microservice.telstra-connect.telstraglobal.com/auth');
const claimsModifier = require('@microservice.telstra-connect.telstraglobal.com/claims-modifier');
const VError = require('verror');

const hasCauseWithName = VError.hasCauseWithName;

async function authorize(config, request, reply, next) {
  try {
    if (!request.headers.authorization || !request.headers.authorization.startsWith('Bearer ')) {
      throw new VError({ name: 'AuthorizeRequestError' }, 'Missing bearer token');
    }
    const token = request.headers.authorization.replace(/^Bearer /, '');
    request.args = claimsModifier(await auth.verify(token, config.auth));
    request.args.token = request.headers.authorization;
    if (request.headers['company-id'] && request.headers['company-id'] !== 'null' && request.headers['company-id'] !== 'undefined') {
      request.args.company = request.headers['company-id'];
    } next();
  } catch (err) {
    request.log.error(`Authentication failed: ${JSON.stringify(err)}`);

    if (hasCauseWithName(err, 'AuthorizeRequestError')) {
      reply.status(401).json({ status: '401', code: 'NOAUTH', message: 'No bearer token presented.' });
    } else if (hasCauseWithName(err, 'VerifyError')) {
      reply.status(401).json({ status: '401', code: 'NOAUTH', message: 'The presented token is invalid.' });
    } else if (hasCauseWithName(err, 'VerifyExpiredError')) {
      reply.status(401).json({ status: '401', code: 'NOAUTH', message: 'The presented token has expired.' });
    } else {
      reply.status(500).json({ status: '500', code: 'INTERNAL', message: 'Internal Service Error' });
    }
  }
}


module.exports = authorize;
