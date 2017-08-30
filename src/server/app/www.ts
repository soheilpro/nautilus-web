import * as path from 'path';
import * as nconf from 'nconf';
import * as express from 'express';
import * as morgan from 'morgan';
import * as compression from 'compression';
import * as debugModule from 'debug';

const debug = debugModule('nautilus-web');

const config = nconf
  .env()
  .file({ file: path.join(__dirname, '../../config/app.json') })
  .defaults({
    'NAUTILUS_WEB_PORT': '3100',
    'NAUTILUS_WEB_API_ADDRESS': 'http://localhost:3000',
  });

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../../client/out'));

app.use(morgan('dev'));
app.use(compression());

app.use('/assets', express.static(path.join(__dirname, '../../client/out/assets'), { maxAge: 365 * 24 * 60 * 60 * 1000 }));

app.use('/assets', (request, response) => {
  response.status(404).send('Not found.');
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

const server = app.listen(Number(config.get('NAUTILUS_WEB_PORT')), () => {
  debug(`Nautilus web listening on port ${server.address().port}`);
});
