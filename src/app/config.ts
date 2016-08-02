var path = require('path');
var nconf = require('nconf');

/// <reference path="./typings/index.d.ts" />

var config = nconf.argv()
    .env()
    .file({ file: path.join(__dirname, '../config.json') })
    .defaults({
      port: 8080
    });

export default config;