import { IActionManager } from '../actions';
import { IApplication } from '../application';
import { ICommandController, ICommandManager } from '../commands';
import { IIssueController } from '../issues';
import { ISearchController } from '../search';
import { IStorage, IAsyncStorage } from '../storage';
import { ITaskController } from '../tasks';
import { IWindowController } from '../windows';

export interface IServiceManager {
  setSessionStorage(storage: IStorage): void;
  getSessionStorage(): IStorage;

  setLocalStorage(storage: IStorage): void;
  getLocalStorage(): IStorage;

  setRoamingStorage(storage: IAsyncStorage): void;
  getRoamingStorage(): IAsyncStorage;

  setApplication(application: IApplication): void;
  getApplication(): IApplication;

  setActionManager(actionManager: IActionManager): void;
  getActionManager(): IActionManager;

  setCommandManager(commandManager: ICommandManager): void;
  getCommandManager(): ICommandManager;

  setWindowController(windowController: IWindowController): void;
  getWindowController(): IWindowController;

  setCommandController(commandController: ICommandController): void;
  getCommandController(): ICommandController;

  setSearchController(searchController: ISearchController): void;
  getSearchController(): ISearchController;

  setIssueController(issueController: IIssueController): void;
  getIssueController(): IIssueController;

  setTaskController(taskController: ITaskController): void;
  getTaskController(): ITaskController;
}
