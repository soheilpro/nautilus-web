var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('nautilus-web');
var passport = require('passport');
var passportLocal = require('passport-local');
var session = require('express-session')
var request = require('request');
var config = require('./config');

passport.use(new passportLocal.Strategy(
  function(username, password, callback) {
    var data = {
      url: config.get('api-url') + '/sessions',
      form: {
        username: username,
        password: password
      }
    };

    request.post(data, function(error, response, body) {
      if (error)
        return callback(error);

      if (response.statusCode !== 201)
        return callback(null, false);

      var body = JSON.parse(body);

      var session = {
        id: body.data.id,
        user: {
          id: body.data.user.id
        }
      };

      callback(null, session);
    });
  }
));

passport.serializeUser(function(session, callback) {
  callback(null, session.id);
});

passport.deserializeUser(function(id, callback) {
  var data = {
    url: config.get('api-url') + '/sessions/' + id
  };

  request.get(data, function(error, response, body) {
    if (error)
      return callback(error);

    var body = JSON.parse(body);

    var session = {
      id: body.data.id,
      user: {
        id: body.data.user.id
      }
    };

    callback(null, session);
  });
});

var app = express();
app.locals.config = config.get();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ name: 'auth', secret: 'e0018575e0744d33ba5cc7c8bc288d74', resave: false, saveUninitialized: false, cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(require('./routes/login'));

app.use(function(request, response, next) {
  if (!request.user)
    return response.redirect('/login');

  response.locals.user = request.user;
  next();
});

app.use('/', require('./routes/index'));

app.use(function(request, response, next) {
  var error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use(function(error, request, response, next) {
  debug(error.stack);
  response.status(error.status || 500);
  response.render('error', {
    message: error.message,
    error: app.get('env') === 'development' ? error : {}
  });
});

module.exports = app;
