const cfNodejsClient = require('cf-nodejs-client');

class discoverService {}
discoverService.discover = function (patterns, options, callback) {
  const servicesMap = new Map();
  cloudInfo(options).then((cfRoutes) => {
    patterns.forEach((pattern) => {
      for (let i = 0; i < cfRoutes.length; i += 1) {
        let serviceName = '';
        if (pattern && pattern.pin) {
          const name = pattern.pin.split(':');
          serviceName = name[1].split(',');
        }
        if (pattern.pin && cfRoutes[i].name === serviceName[0]) {
          servicesMap.set(pattern.pin, {
            host: cfRoutes[i].url,
            port: 443,
            protocol: 'https',
            timeout: 60000,
          });
          break;
        }
      }
    });
    return callback(null, servicesMap);
  }).catch(err => callback(err, null));
};

function cloudInfo(options) {
  return new Promise((resolve, reject) => {
    const endpoint = process.env.DOMAIN || options.domain;
    const username = process.env.NAME || options.name;
    const password = process.env.PASSWORD || options.password;
    let accessToken;

    const CloudController = new cfNodejsClient.CloudController(endpoint);
    const UsersUAA = new cfNodejsClient.UsersUAA();
    const Apps = new cfNodejsClient.Apps(endpoint);
    CloudController.getInfo().then((result) => {
      UsersUAA.setEndPoint(result.authorization_endpoint);
      return UsersUAA.login(username, password);
    }).then((token) => {
      Apps.setToken(token);
      accessToken = token;
      return Apps.getApps();
    }).then((result) => {
      const list = [];
      result.resources.forEach((microservice) => {
        if (microservice.entity.state === 'STARTED') {
          list.push({ name: microservice.entity.name, app_id: microservice.metadata.guid });
        }
      });
      const promiseList = [];
      list.forEach((app) => {
        Apps.setToken(accessToken);
        const appProperties = Apps.getEnvironmentVariables(app.app_id);
        promiseList.push(appProperties);
      });
      Promise.all(promiseList).then((results) => {
        const urlList = [];
        results.forEach((app) => {
          urlList.push({
            name: app.application_env_json.VCAP_APPLICATION.application_name,
            url: app.application_env_json.VCAP_APPLICATION.application_uris[0],
          });
        });
        resolve(urlList);
      });
    })
      .catch((err) => {
        console.error(`Error: ${err}`);
        reject(err.message);
      });
  });
}
module.exports = discoverService;
