/// <reference path="../typings/index.d.ts" />

var express = require('express');
var passport = require('passport');

var router = express.Router();

router.get('/login', (request, response) => {
  response.render('login');
});

router.post('/login', (request, response, next) => {
  passport.authenticate('local', (error, user, info) => {
    if (error)
      return next(error);

    if (!user)
      return response.render('login', { failed: true });

    request.logIn(user, (error) => {
      if (error)
        return next(error);

      return response.redirect('/');
    });
  })(request, response, next);
});

export = router;