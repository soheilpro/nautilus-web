import { IApplication } from '../application';
import { ICommandManager } from '../commands';
import { IKeyBindingManager } from '../key-bindings';
import { ISearchManager } from '../search';

export interface IServiceManager {
  setApplication(application: IApplication): void;
  getApplication(): IApplication;
  setCommandManager(CommandManager: ICommandManager): void;
  getCommandManager(): ICommandManager;
  setKeyBindingManager(keyBindingManager: IKeyBindingManager): void;
  getKeyBindingManager(): IKeyBindingManager;
  setSearchManager(searchManager: ISearchManager): void;
  getSearchManager(): ISearchManager;
}
