#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('./app');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = process.env.PORT || '8082';
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port,(err)=>{
    console.log("Listening to port--"+port);
});
