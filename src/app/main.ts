import React from 'react';
import ReactDOM from 'react-dom';
import { Application } from './application';
import { ActionManager } from './actions';
import { CommandManager } from './commands';
import { ServiceManager } from './services';
import { LocalStorage, SessionStorage, RoamingStorage } from './storage';
import App from './components/app';

ServiceManager.Instance = new ServiceManager();

const sessionStorage = new SessionStorage();
ServiceManager.Instance.setSessionStorage(sessionStorage);

const localStorage = new LocalStorage();
ServiceManager.Instance.setLocalStorage(localStorage);

const roamingStorage = new RoamingStorage();
ServiceManager.Instance.setRoamingStorage(roamingStorage);

const application = new Application({ address: 'http://localhost:3000' });
application.initialize();
ServiceManager.Instance.setApplication(application);

const actionManager = new ActionManager();
ServiceManager.Instance.setActionManager(actionManager);

const commandManager = new CommandManager();
ServiceManager.Instance.setCommandManager(commandManager);

ReactDOM.render(
  React.createElement(App),
  document.getElementById('app')
);
