var path = require('path');
var nconf = require('nconf');

nconf.argv()
     .env()
     .file({ file: path.join(__dirname, 'config.json') })
     .defaults({
       port: 8080
     });

module.exports = nconf;