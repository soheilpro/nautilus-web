#!/usr/bin/env node

var debug = require('debug')('odin-web');
var config = require('./config');
var app = require('./app');

var server = app.listen(config.get('port'), function() {
  debug('Odin web listening on port ' + server.address().port);
});
