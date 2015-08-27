var express = require('express');
var passport = require('passport');

var router = express.Router();

router.get('/login', function(request, response) {
  response.render('login');
});

router.post('/login', function(request, response, next) {
  passport.authenticate('local', function(error, user, info) {
    if (error)
      return next(error);

    if (!user)
      return response.render('login', { failed: true });

    request.logIn(user, function(error) {
      if (error)
        return next(error);

      return response.redirect('/');
    });
  })(request, response, next);
});

module.exports = router;
