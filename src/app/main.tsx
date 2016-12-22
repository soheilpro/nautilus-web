import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Client from './sdk';
import Application from './application';
import App from './components/app';

require('./assets/stylesheets/main.less');

let client = new Client();
client.address = 'http://localhost:3000';

Application.Instance = new Application(client);
Application.Instance.initialize();

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
