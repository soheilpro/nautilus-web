import { IActionManager } from '../actions';
import { IApplication } from '../application';
import { ICommandController, ICommandManager } from '../commands';
import { IIssueController } from '../issues';
import { ITaskController } from '../tasks';
import { IWindowManager } from '../windows';

export interface IServiceManager {
  setApplication(application: IApplication): void;
  getApplication(): IApplication;
  setActionManager(actionManager: IActionManager): void;
  getActionManager(): IActionManager;
  setCommandManager(commandManager: ICommandManager): void;
  getCommandManager(): ICommandManager;
  setWindowManager(windowManager: IWindowManager): void;
  getWindowManager(): IWindowManager;
  setCommandController(commandController: ICommandController): void;
  getCommandController(): ICommandController;
  setIssueController(issueController: IIssueController): void;
  getIssueController(): IIssueController;
  setTaskController(taskController: ITaskController): void;
  getTaskController(): ITaskController;
}
