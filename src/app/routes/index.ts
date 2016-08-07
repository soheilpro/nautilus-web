var express = require('express');

var router = express.Router();

router.get('/', (request: any, response: any) => {
  response.render('index', { session: request.user });
});

export = router;