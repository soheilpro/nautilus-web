import { IApplication } from '../application';
import { ICommandManager } from '../commands';
import { IKeyBindingManager } from '../key-bindings';

export interface IServiceManager {
  setApplication(application: IApplication): void;
  getApplication(): IApplication;
  setCommandManager(CommandManager: ICommandManager): void;
  getCommandManager(): ICommandManager;
  setKeyBindingManager(keyBindingManager: IKeyBindingManager): void;
  getKeyBindingManager(): IKeyBindingManager;
}

export default class ServiceManager {
  static Instance: IServiceManager;

  private application: IApplication;
  private CommandManager: ICommandManager;
  private keyBindingManager: IKeyBindingManager;

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
}
