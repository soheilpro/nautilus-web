import { IUserService, UserService } from './user';
import { ISession, ISessionService, SessionService } from './session';
import { IProjectService, ProjectService } from './project';
import { IItemStateService, ItemStateService } from './item_state';
import { IItemTypeService, ItemTypeService } from './item_type';
import { IItemPriorityService, ItemPriorityService } from './item_priority';
import { IItemService, ItemService } from './item';

export interface INautilusClient {
  address: string;
  session: ISession;
  users: IUserService;
  sessions: ISessionService;
  projects: IProjectService;
  itemStates: IItemStateService;
  itemTypes: IItemTypeService;
  itemPriorities: IItemPriorityService;
  items: IItemService;
}

export class NautilusClient implements INautilusClient {
  address: string;
  session: ISession;
  users: IUserService;
  sessions: ISessionService;
  projects: IProjectService;
  itemStates: IItemStateService;
  itemTypes: IItemTypeService;
  itemPriorities: IItemPriorityService;
  items: IItemService;

  constructor() {
    this.users = new UserService(this);
    this.sessions = new SessionService(this);
    this.projects = new ProjectService(this);
    this.itemStates = new ItemStateService(this);
    this.itemTypes = new ItemTypeService(this);
    this.itemPriorities = new ItemPriorityService(this);
    this.items = new ItemService(this);
  }
}
