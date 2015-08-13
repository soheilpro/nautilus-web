#!/usr/bin/env node

var debug = require('debug')('odin-web');
var app = require('./app');

app.set('port', process.env.PORT || 3001);

var server = app.listen(app.get('port'), function() {
  debug('Odin web listening on port ' + server.address().port);
});
