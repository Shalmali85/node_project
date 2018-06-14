
var Seneca = require('seneca')
var Express = require('express')
const app = Express();
var Web = require('seneca-web')
var port= process.env.PORT || 8080
const Service = require('./index');
const service = new Service({domain:"https://api.run.pivotal.io",name:"***",password:"***"});

var Routes = [{
    prefix: '/api',
    pin: 'role:incident-client,cmd:*',
    map: {
        getIncidentId: {GET: true,name:'',suffix:"/incidents/:id"},
        incidents: {GET: true,name:'',suffix:"/incidents"}

        }
}]
const timeout = parseInt(process.env.TRANSPORT_TIMEOUT, 10) || 5555;

var seneca = Seneca({ transport: { timeout } })
seneca.fixedargs['fatal$'] = false;

var config = {
    routes: Routes,
    adapter: require('seneca-web-adapter-express'),
    context: app,
    options: {
        parseBody: false},

}
app.use(service.find([{pin:'role:incidents'}]));
    seneca.use('incident-client.js')
        .use(Web, config)
        .ready(() => {
            var server = seneca.export('web/context')()
            server.listen(port, () => {
                console.log('server started on: ' + port);
            })
        })

/


