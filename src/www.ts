#!/usr/bin/env node

/// <reference path="./typings/index.d.ts" />

import config from './config';
import app from './app';

var debug = require('debug')('nautilus-web');

var server = app.listen(config.get('port'), function() {
  debug('Nautilus web listening on port ' + server.address().port);
});
