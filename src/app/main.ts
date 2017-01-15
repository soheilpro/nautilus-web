import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Application } from './application';
import { ActionManager } from './actions';
import { CommandManager } from './commands';
import { ServiceManager } from './services';
import App from './components/app';

require('./assets/stylesheets/main.less');

ServiceManager.Instance = new ServiceManager();

let application = new Application({ address: 'http://localhost:3000' });
application.initialize();
ServiceManager.Instance.setApplication(application);

let actionManager = new ActionManager();
ServiceManager.Instance.setActionManager(actionManager);

let commandManager = new CommandManager();
ServiceManager.Instance.setCommandManager(commandManager);

ReactDOM.render(
  React.createElement(App),
  document.getElementById('app')
);
