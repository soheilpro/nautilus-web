import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ServiceManager from './service-manager';
import Application from './application';
import Controller from './controller';

import App from './components/app';

require('./assets/stylesheets/main.less');

ServiceManager.Instance = new ServiceManager();

let application = new Application({ apiAddress: 'http://localhost:3000' });
application.initialize();
ServiceManager.Instance.setApplication(application);

let controller = new Controller();
ServiceManager.Instance.setController(controller);

ReactDOM.render(
  React.createElement(App),
  document.getElementById('app')
);
