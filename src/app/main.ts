import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Application } from './application';
import { ActionManager } from './actions';
import { CommandManager } from './commands';
import { ServiceManager } from './services';
import { LocalStorage, SessionStorage, RoamingStorage } from './storage';
import App from './components/app';

ServiceManager.Instance = new ServiceManager();

let sessionStorage = new SessionStorage();
ServiceManager.Instance.setSessionStorage(sessionStorage);

let localStorage = new LocalStorage();
ServiceManager.Instance.setLocalStorage(localStorage);

let roamingStorage = new RoamingStorage();
ServiceManager.Instance.setRoamingStorage(roamingStorage);

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
