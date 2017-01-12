import { IApplication } from '../application';
import { IActionManager } from '../actions';
import { ICommandManager } from '../commands';
import { IIssueController } from '../issues';

export interface IServiceManager {
  setApplication(application: IApplication): void;
  getApplication(): IApplication;
  setActionManager(actionManager: IActionManager): void;
  getActionManager(): IActionManager;
  setCommandManager(commandManager: ICommandManager): void;
  getCommandManager(): ICommandManager;
  setIssueController(issueController: IIssueController): void;
  getIssueController(): IIssueController;
}
