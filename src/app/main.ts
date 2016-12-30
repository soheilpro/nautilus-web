import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Application } from './application';
import { CommandManager } from './commands';
import { KeyBindingManager } from './key-bindings';
import { ServiceManager } from './services';
import { SearchManager } from './search';
import App from './components/app';

require('./assets/stylesheets/main.less');

ServiceManager.Instance = new ServiceManager();

let application = new Application({ address: 'http://localhost:3000' });
application.initialize();
ServiceManager.Instance.setApplication(application);

let commandManager = new CommandManager();
ServiceManager.Instance.setCommandManager(commandManager);

let keyBindingManager = new KeyBindingManager();
ServiceManager.Instance.setKeyBindingManager(keyBindingManager);

let searchManager = new SearchManager();
ServiceManager.Instance.setSearchManager(searchManager);

ReactDOM.render(
  React.createElement(App),
  document.getElementById('app')
);
