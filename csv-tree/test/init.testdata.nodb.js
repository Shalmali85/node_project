module.exports = {
  couchbase: {
    host: '/config/couchbase.js',
  },
  router: {
    noValidation: true,
    port: process.env.PORT || 3000,
    level: 'debug',
  },
};
