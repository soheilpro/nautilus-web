var express = require('express');
var passport = require('passport');

var router = express.Router();

router.get('/login', function(request, response) {
  response.render('login');
});

router.post('/login', function(request, response, next) {
  passport.authenticate('local', function(error, user, info) {
    if (error) {
      next(error);
      return;
    }

    if (!user) {
      response.render('login', { failed: true });
      return;
    }

    request.logIn(user, function(error) {
      if (error) {
        next(error);
        return;
      }

      return response.redirect('/');
    });
  })(request, response, next);
});

module.exports = router;
