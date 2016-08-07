import config from './config';

var express = require('express');
var path = require('path');
var logger = require('morgan');
var debug = require('debug')('nautilus-web');

var app = express();
app.locals.config = config.get();

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use('/assets', express.static(path.join(__dirname, '../assets')));
app.use('/', require('./routes/index'));

app.use(function(request: any, response: any, next: any) {
  var error: any = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use(function(error: any, request: any, response: any, next: any) {
  debug(error.stack);
  response.status(error.status || 500);
  response.render('error', {
    message: error.message,
    error: app.get('env') === 'development' ? error : {}
  });
});

export default app;