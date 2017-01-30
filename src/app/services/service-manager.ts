import { IApplication } from '../application';
import { IActionManager } from '../actions';
import { ICommandController, ICommandManager } from '../commands';
import { IIssueController } from '../issues';
import { ITaskController } from '../tasks';
import { IWindowManager } from '../windows';
import { IServiceManager } from './iservice-manager';

export class ServiceManager implements IServiceManager {
  static Instance: IServiceManager;

  private application: IApplication;
  private actionManager: IActionManager;
  private commandManager: ICommandManager;
  private commandController: ICommandController;
  private issueController: IIssueController;
  private taskController: ITaskController;
  private windowManager: IWindowManager;

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

  setCommandController(commandController: ICommandController) {
    this.commandController = commandController;
  }

  getCommandController() {
    return this.commandController;
  }

  setIssueController(issueController: IIssueController) {
    this.issueController = issueController;
  }

  getIssueController() {
    return this.issueController;
  }

  setTaskController(taskController: ITaskController) {
    this.taskController = taskController;
  }

  getTaskController() {
    return this.taskController;
  }

  setWindowManager(windowManager: IWindowManager) {
    this.windowManager = windowManager;
  }

  getWindowManager() {
    return this.windowManager;
  }
}
