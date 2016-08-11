#!/usr/bin/env node

import config from './config';
import app from './app';

var debug = require('debug')('nautilus-web');

var server = app.listen(config.get('NAUTILUS_WEB_PORT'), function() {
  debug('Nautilus web listening on port ' + server.address().port);
});
