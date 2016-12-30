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
