
const incidentsCli = function () {
  this.add({ role: 'incident-client', cmd: 'getIncidentId' }, function (args, done) {
    this.client = this.client(args.request$.clientUrl.get('role:incidents'));
    this.act('role:incidents,cmd:getIncidentId', { headers: args.request$.headers, params: args.args.params }, (err, result) => {
      if (result) {
        return done(null, result);
      }
      console.log(err);
      return done(new Error(err.message), null);
    });
  });


  this.add({ role: 'incident-client', cmd: 'incidents' }, function (args, done) {
    this.client = this.client(args.request$.clientUrl.get('role:incidents'));
    this.act('role:incidents,cmd:getIncidents', (err, result) => {
      if (result) {
        return done(null, result);
      }
      console.log(err);
      return done(new Error(err.message), null);
    });
  });
};
module.exports = incidentsCli;
