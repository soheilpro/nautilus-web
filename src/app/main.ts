import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ServiceManager from './services';
import Application from './application';
import { CommandManager } from './commands';
import KeyBindingManager from './key-bindings';
import App from './components/app';

require('./assets/stylesheets/main.less');

ServiceManager.Instance = new ServiceManager();

let application = new Application({ apiAddress: 'http://localhost:3000' });
application.initialize();
ServiceManager.Instance.setApplication(application);

let commandManager = new CommandManager();
ServiceManager.Instance.setCommandManager(commandManager);

let keyBindingManager = new KeyBindingManager();
ServiceManager.Instance.setKeyBindingManager(keyBindingManager);

ReactDOM.render(
  React.createElement(App),
  document.getElementById('app')
);
