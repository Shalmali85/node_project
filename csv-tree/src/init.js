const nock = require('nock');
const jwks = require('./jwks.json');
const fs = require('fs');

async function init(config) {
  if (process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'test') {
    nock('http://localhost.com')
      .persist()
      .get('/auth/jwks/keys')
      .reply(200, jwks);
  }

  const pkg = JSON.parse(fs.readFileSync(`${process.cwd()}/package.json`));
  Object.assign(config, { pkg });
}

module.exports = init;
