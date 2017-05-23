import { IActionManager } from '../actions';
import { IApplication } from '../application';
import { IContextManager } from '../context';
import { IActionController } from '../actions';
import { ICommandController, ICommandManager } from '../commands';
import { IIssueController } from '../issues';
import { IMilestoneController } from '../milestones';
import { INotificationController } from '../notifications';
import { ISearchController } from '../search';
import { IStorage } from '../storage';
import { IWindowController } from '../windows';

export interface IServiceManager {
  setSessionStorage(storage: IStorage): void;
  getSessionStorage(): IStorage;

  setLocalStorage(storage: IStorage): void;
  getLocalStorage(): IStorage;

  setRoamingStorage(storage: IStorage): void;
  getRoamingStorage(): IStorage;

  setApplication(application: IApplication): void;
  getApplication(): IApplication;

  setContextManager(contextManager: IContextManager): void;
  getContextManager(): IContextManager;

  setCommandController(commandController: ICommandController): void;
  getCommandController(): ICommandController;

  setCommandManager(commandManager: ICommandManager): void;
  getCommandManager(): ICommandManager;

  setActionController(actionController: IActionController): void;
  getActionController(): IActionController;

  setActionManager(actionManager: IActionManager): void;
  getActionManager(): IActionManager;

  setWindowController(windowController: IWindowController): void;
  getWindowController(): IWindowController;

  setNotificationController(notificationController: INotificationController): void;
  getNotificationController(): INotificationController;

  setSearchController(searchController: ISearchController): void;
  getSearchController(): ISearchController;

  setIssueController(issueController: IIssueController): void;
  getIssueController(): IIssueController;

  setMilestoneController(milestoneController: IMilestoneController): void;
  getMilestoneController(): IMilestoneController;
}
