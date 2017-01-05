import { IApplication } from '../application';
import { IActionManager } from '../actions';
import { ICommandManager } from '../commands';
import { IServiceManager } from './iservice-manager';

export class ServiceManager {
  static Instance: IServiceManager;

  private application: IApplication;
  private actionManager: IActionManager;
  private commandManager: ICommandManager;

  setApplication(application: IApplication) {
    this.application = application;
  }

  getApplication() {
    return this.application;
  }

  setActionManager(actionManager: IActionManager) {
    this.actionManager = actionManager;
  }

  getActionManager() {
    return this.actionManager;
  }

  setCommandManager(commandManager: ICommandManager) {
    this.commandManager = commandManager;
  }

  getCommandManager() {
    return this.commandManager;
  }
}
