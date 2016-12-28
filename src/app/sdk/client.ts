import { IClient } from './iclient';
import { ItemPriorityService, IItemPriorityService } from './item-priority';
import { ItemService, IItemService } from './item';
import { ItemStateService, IItemStateService } from './item-state';
import { ItemTypeService, IItemTypeService } from './item-type';
import { ProjectService, IProjectService } from './project';
import { SessionService, ISessionService, ISession } from './session';
import { UserService, IUserService } from './user';

interface IClientConfig {
  address: string;
}

export class Client implements IClient {
  address: string;
  session: ISession;
  users: IUserService;
  sessions: ISessionService;
  projects: IProjectService;
  itemPriorities: IItemPriorityService;
  itemStates: IItemStateService;
  itemTypes: IItemTypeService;
  items: IItemService;

  constructor({ address }: IClientConfig) {
    this.address = address;
    this.users = new UserService(this);
    this.sessions = new SessionService(this);
    this.projects = new ProjectService(this);
    this.itemPriorities = new ItemPriorityService(this);
    this.itemStates = new ItemStateService(this);
    this.itemTypes = new ItemTypeService(this);
    this.items = new ItemService(this);
  }
}
