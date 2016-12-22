import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Client from './sdk';
import App from './app';
import Application from './components/application';

require('./assets/stylesheets/main.less');

let client = new Client();
client.address = 'http://localhost:3000';

App.Instance = new App(client);
App.Instance.initialize();

ReactDOM.render(
  <Application />,
  document.getElementById('app')
);
