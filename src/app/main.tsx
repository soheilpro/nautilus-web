import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ServiceManager from './service-manager';
import Application from './application';
import App from './components/app';

require('./assets/stylesheets/main.less');

ServiceManager.Instance = new ServiceManager();

let application = new Application({ apiAddress: 'http://localhost:3000' });
application.initialize();
ServiceManager.Instance.setApplication(application);

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
