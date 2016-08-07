import { IUserService, UserService } from './user';
import { ISession, ISessionService, SessionService } from './session';
import { IProjectService, ProjectService } from './project';
import { IStateService, StateService } from './state';
import { IItemService, ItemService } from './item';

export interface INautilusClient {
  address: string;
  session: ISession;
  users: IUserService;
  sessions: ISessionService;
  projects: IProjectService;
  states: IStateService;
  items: IItemService;
}

export class NautilusClient implements INautilusClient {
  address: string;
  session: ISession;
  users: IUserService;
  sessions: ISessionService;
  projects: IProjectService;
  states: IStateService;
  items: IItemService;

  constructor() {
    this.users = new UserService(this);
    this.sessions = new SessionService(this);
    this.projects = new ProjectService(this);
    this.states = new StateService(this);
    this.items = new ItemService(this);
  }
}
