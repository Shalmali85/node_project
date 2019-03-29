/* eslint-disable camelcase,radix */
const rp = require('request-promise');

function validateUser(config, token) {
  const requestOptions = {
    method: 'GET',
    uri: `${config.ccvCustomersUrl}/Billing`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    json: true,
    rejectUnauthorized: false,
  };
  return rp(requestOptions);
}

async function ccvUserCheck(config, req, res, next) {
  try {
    if (!req.args) {
      req.args = {};
    }
    const appUserList = await validateUser(config, req.args.token);
    if (appUserList.data.length < 1) {
      return res.status(403).json({ status: '403', code: '403', message: 'User lacks access to the resource' }, 403);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: '500', code: '500', message: err.message }, 500);
  }
  return next();
}

module.exports = ccvUserCheck;
