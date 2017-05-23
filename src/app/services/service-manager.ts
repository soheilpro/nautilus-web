import { IActionManager } from '../actions';
import { IApplication } from '../application';
import { IContextManager } from '../context';
import { IActionController } from '../actions';
import { ICommandController, ICommandManager } from '../commands';
import { IIssueController } from '../issues';
import { IMilestoneController } from '../milestones';
import { INotificationController } from '../notifications';
import { ISearchController } from '../search';
import { IServiceManager } from './iservice-manager';
import { IStorage } from '../storage';
import { IWindowController } from '../windows';

export class ServiceManager implements IServiceManager {
  static Instance: IServiceManager;

  private sessionStorage: IStorage;
  private localStorage: IStorage;
  private roamingStorage: IStorage;
  private application: IApplication;
  private contextManager: IContextManager;
  private commandManager: ICommandManager;
  private commandController: ICommandController;
  private actionController: IActionController;
  private actionManager: IActionManager;
  private windowController: IWindowController;
  private notificationController: INotificationController;
  private searchController: ISearchController;
  private issueController: IIssueController;
  private milestoneController: IMilestoneController;

  setSessionStorage(storage: IStorage) {
    this.sessionStorage = storage;
  }

  getSessionStorage(): IStorage {
    return this.sessionStorage;
  }

  setLocalStorage(storage: IStorage) {
    this.localStorage = storage;
  }

  getLocalStorage(): IStorage {
    return this.localStorage;
  }

  setRoamingStorage(storage: IStorage) {
    this.roamingStorage = storage;
  }

  getRoamingStorage(): IStorage {
    return this.roamingStorage;
  }

  setApplication(application: IApplication) {
    this.application = application;
  }

  getApplication() {
    return this.application;
  }

  setContextManager(contextManager: IContextManager) {
    this.contextManager = contextManager;
  }

  getContextManager() {
    return this.contextManager;
  }

  setCommandController(commandController: ICommandController) {
    this.commandController = commandController;
  }

  getCommandController() {
    return this.commandController;
  }

  setCommandManager(commandManager: ICommandManager) {
    this.commandManager = commandManager;
  }

  getCommandManager() {
    return this.commandManager;
  }

  setActionController(actionController: IActionController) {
    this.actionController = actionController;
  }

  getActionController() {
    return this.actionController;
  }

  setActionManager(actionManager: IActionManager) {
    this.actionManager = actionManager;
  }

  getActionManager() {
    return this.actionManager;
  }

  setWindowController(windowController: IWindowController) {
    this.windowController = windowController;
  }

  getWindowController() {
    return this.windowController;
  }

  setNotificationController(notificationController: INotificationController) {
    this.notificationController = notificationController;
  }

  getNotificationController() {
    return this.notificationController;
  }

  setSearchController(searchController: ISearchController) {
    this.searchController = searchController;
  }

  getSearchController() {
    return this.searchController;
  }

  setIssueController(issueController: IIssueController) {
    this.issueController = issueController;
  }

  getIssueController() {
    return this.issueController;
  }

  setMilestoneController(milestoneController: IMilestoneController) {
    this.milestoneController = milestoneController;
  }

  getMilestoneController() {
    return this.milestoneController;
  }
}
