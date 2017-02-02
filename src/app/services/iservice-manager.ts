import { IActionManager } from '../actions';
import { IApplication } from '../application';
import { ICommandController, ICommandManager } from '../commands';
import { ISearchController } from '../search';
import { IIssueController } from '../issues';
import { ITaskController } from '../tasks';
import { IWindowController } from '../windows';

export interface IServiceManager {
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
