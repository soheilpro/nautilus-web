import { IActionManager } from '../actions';
import { IApplication } from '../application';
import { ICommandManager } from '../commands';
import { IIssueController } from '../issues';
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
  setIssueController(issueController: IIssueController): void;
  getIssueController(): IIssueController;
}
