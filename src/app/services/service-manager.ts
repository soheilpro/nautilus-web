import { IApplication } from '../application';
import { ICommandManager } from '../commands';
import { IServiceManager } from './iservice-manager';

export class ServiceManager {
  static Instance: IServiceManager;

  private application: IApplication;
  private CommandManager: ICommandManager;

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
}
