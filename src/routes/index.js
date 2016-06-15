var express = require('express');

var router = express.Router();

router.get('/', function(request, response) {
  response.render('index', { session: request.user });
});

module.exports = router;