
const Seneca = require('seneca');
const Express = require('express');

const app = Express();
const Web = require('seneca-web');
const adapter = require('seneca-web-adapter-express');

const port = process.env.PORT || 4000;
const Service = require('../src/index');

const service = new Service({ domain: 'https://api.run.pivotal.io', name: '*', password: '*' });

const Routes = [{
  prefix: '/api',
  pin: 'role:incident-client,cmd:*',
  map: {
    getIncidentId: { GET: true, name: '', suffix: '/incidents/:id' },
    incidents: { GET: true, name: '', suffix: '/incidents' },

  },
}];
const timeout = parseInt(process.env.TRANSPORT_TIMEOUT, 10) || 5555;

const seneca = Seneca({ transport: { timeout } });
seneca.fixedargs.fatal$ = false;

const config = {
  routes: Routes,
  adapter,
  context: app,
  options: {
    parseBody: false },

};
app.use(service.find([{ pin: 'role:incidents' }]));

seneca.use('incident-client.js')
  .use(Web, config)
  .ready(() => {
    const server = seneca.export('web/context')();
    server.listen(port, () => {
      console.log(`server started on: ${port}`);
    });
  });



