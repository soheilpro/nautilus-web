import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Application } from './application';
import { ContextManager } from './context';
import { ActionManager } from './actions';
import { CommandManager } from './commands';
import { ServiceManager } from './services';
import { LocalStorage, SessionStorage } from './storage';
import App from './components/app';

async function main() {
  ServiceManager.Instance = new ServiceManager();

  const sessionStorage = new SessionStorage();
  ServiceManager.Instance.setSessionStorage(sessionStorage);

  const localStorage = new LocalStorage();
  ServiceManager.Instance.setLocalStorage(localStorage);

  const roamingStorage = new LocalStorage();
  ServiceManager.Instance.setRoamingStorage(roamingStorage);

  const application = new Application({ address: 'http://localhost:3000' });
  await application.initialize();
  ServiceManager.Instance.setApplication(application);

  const contextManager = new ContextManager();
  ServiceManager.Instance.setContextManager(contextManager);

  const actionManager = new ActionManager();
  ServiceManager.Instance.setActionManager(actionManager);

  const commandManager = new CommandManager();
  ServiceManager.Instance.setCommandManager(commandManager);

  ReactDOM.render(
    React.createElement(App),
    document.getElementById('app')
  );
}

main();
