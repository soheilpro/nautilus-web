import { IApplication } from '../application';
import { ICommandManager } from '../commands';
import { IKeyBindingManager } from '../key-bindings';
import { ISearchManager } from '../search';
import { IServiceManager } from './iservice-manager';

export class ServiceManager {
  static Instance: IServiceManager;

  private application: IApplication;
  private CommandManager: ICommandManager;
  private keyBindingManager: IKeyBindingManager;
  private searchManager: ISearchManager;

  setApplication(application: IApplication) {
    this.application = application;
  }

  getApplication() {
    return this.application;
  }

  setCommandManager(CommandManager: ICommandManager) {
    this.CommandManager = CommandManager;
  }

  getCommandManager() {
    return this.CommandManager;
  }

  setKeyBindingManager(keyBindingManager: IKeyBindingManager) {
    this.keyBindingManager = keyBindingManager;
  }

  getKeyBindingManager() {
    return this.keyBindingManager;
  }

  setSearchManager(searchManager: ISearchManager) {
    this.searchManager = searchManager;
  }

  getSearchManager() {
    return this.searchManager;
  }
}
