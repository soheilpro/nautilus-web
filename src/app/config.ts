var path = require('path');
var nconf = require('nconf');

var config = nconf
    .env()
    .file({ file: path.join(__dirname, '../../config/app.json') })
    .defaults({
      'NAUTILUS_WEB_PORT': 3100,
      'NAUTILUS_WEB_API_ADDRESS': 'http://localhost:3000',
      'NAUTILUS_WEB_RTL': false
    });

export default config;