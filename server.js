"use strict";

var express = require('express');
var http = require('http');

var serverPort = process.env.PORT || 3000;
var nodeEnv = process.env.NODE_ENV || 'development';

// setup express
var app = exports.app = express();
var server = http.createServer(app);

// Define a new route
app.get('/hello-express', function (req, res) {
  res.send('Hello Deployd!');
});

// heroku requires these settings for sockets to work
server.sockets.manager.settings.transports = ["xhr-polling"];

// setup deployd
require('deployd').attach(server, {
  env: nodeEnv,
  db: {
    connectionString: process.env.MONGOHQ_URL
                        || process.env.MONGOLAB_URI
                        || 'mongodb://localhost:27017/deployd'
  }
});

// After attach, express can use server.handleRequest as middleware
app.use(server.handleRequest);

// start server
server.listen(serverPort, function() {
  var serverAddr = server.address().address == '0.0.0.0' ? 'localhost' : server.address().address;
  console.log('Express & Deployd started.\n\nPlease visit http://%s:%s', serverAddr, server.address().port);
});
