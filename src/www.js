#!/usr/bin/env node

const path = require('path');
const nconf = require('nconf');
const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const debug = require('debug')('nautilus-web');

const config = nconf
  .env()
  .file({ file: path.join(__dirname, '../config/app.json') })
  .defaults({
    'NAUTILUS_WEB_PORT': 3100,
    'NAUTILUS_WEB_API_ADDRESS': 'http://localhost:3000',
  });

const app = express();
app.set('view engine', 'ejs');
app.set('views', './out');

app.use(morgan('dev'));
app.use(compression());

app.use('/assets', express.static(path.join(__dirname, './out/assets'), { maxAge: 365 * 24 * 60 * 60 * 1000 }));

app.use('/assets', (request, response) => {
  response.status(404).send("Not found.");
});

app.get('*', (request, response) => {
  const locals = {
    config: {
      api: {
        address: config.get('NAUTILUS_WEB_API_ADDRESS'),
      },
    },
  };

  response.render('index', locals);
});

const server = app.listen(config.get('NAUTILUS_WEB_PORT'), () => {
  debug(`Nautilus web listening on port ${server.address().port}`);
});
