var express = require('express');

var router = express.Router();

router.get('/', (request, response) => {
  response.render('index', { session: request.user });
});

export = router;