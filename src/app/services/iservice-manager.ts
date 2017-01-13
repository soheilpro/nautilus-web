import { IApplication } from '../application';
import { IActionManager } from '../actions';
import { ICommandManager } from '../commands';
import { IControllerManager } from '../controllers';

export interface IServiceManager {
  setApplication(application: IApplication): void;
  getApplication(): IApplication;
  setActionManager(actionManager: IActionManager): void;
  getActionManager(): IActionManager;
  setCommandManager(commandManager: ICommandManager): void;
  getCommandManager(): ICommandManager;
  setControllerManager(controllerManager: IControllerManager): void;
  getControllerManager(): IControllerManager;
}
