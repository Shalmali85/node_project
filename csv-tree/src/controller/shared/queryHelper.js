const DataStore = require('tc-datastore').DataStore;

const dataStore = new DataStore();


function getBillingAccountNumbers(config, documentId) {
  dataStore.connect(config.couchbase.url);
  const bucketName = config.couchbase.bucket;
  return new Promise((resolve, reject) => {
    dataStore.getAsync(bucketName, documentId).then((response) => {
      if (response && response.value) {
        resolve(response);
      } else {
        resolve([]);
      }
    }).catch((err) => {
      reject(err);
    });
  });
}


module.exports = {getBillingAccountNumbers };

