import { IUserService, UserService } from './user';
import { ISession, ISessionService, SessionService } from './session';
import { IProjectService, ProjectService } from './project';
import { IItemStateService, ItemStateService } from './item-state';
import { IItemTypeService, ItemTypeService } from './item-type';
import { IItemPriorityService, ItemPriorityService } from './item-priority';
import { IItemService, ItemService } from './item';

interface IClientConfig {
  apiAddress: string;
}

export interface IClient {
  config: IClientConfig;
  session: ISession;
  users: IUserService;
  sessions: ISessionService;
  projects: IProjectService;
  itemStates: IItemStateService;
  itemTypes: IItemTypeService;
  itemPriorities: IItemPriorityService;
  items: IItemService;
}

export default class Client implements IClient {
  config: IClientConfig;
  session: ISession;
  users: IUserService;
  sessions: ISessionService;
  projects: IProjectService;
  itemStates: IItemStateService;
  itemTypes: IItemTypeService;
  itemPriorities: IItemPriorityService;
  items: IItemService;

  constructor(config: IClientConfig) {
    this.config = config;
    this.users = new UserService(this);
    this.sessions = new SessionService(this);
    this.projects = new ProjectService(this);
    this.itemStates = new ItemStateService(this);
    this.itemTypes = new ItemTypeService(this);
    this.itemPriorities = new ItemPriorityService(this);
    this.items = new ItemService(this);
  }
}
