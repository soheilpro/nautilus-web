import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Client from './sdk';
import Application from './application';
import App from './components/app';

require('./assets/stylesheets/main.less');

Application.Instance = new Application({ apiAddress: 'http://localhost:3000' });
Application.Instance.initialize();

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
