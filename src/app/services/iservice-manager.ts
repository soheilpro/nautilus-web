import { IApplication } from '../application';
import { ICommandManager } from '../commands';

export interface IServiceManager {
  setApplication(application: IApplication): void;
  getApplication(): IApplication;
  setCommandManager(CommandManager: ICommandManager): void;
  getCommandManager(): ICommandManager;
}
