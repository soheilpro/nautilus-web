import Client, { IClient, IEntity, ISession, IUser, IUserPermission, IProject, IItemState, IItemType, IItemPriority } from '../sdk';
import EventEmitter = require('wolfy87-eventemitter');

interface IApplicationState {
  isInitialized?: boolean;
  session?: ISession;
  isLoaded?: boolean;
  userPermissions?: IUserPermission[];
  users?: IUser[];
  projects?: IProject[];
  itemStates?: IItemState[];
  itemTypes?: IItemType[];
  itemPriorities?: IItemPriority[];
}

interface IApplicationConfig {
  apiAddress: string;
}

export interface IApplication extends EventEmitter {
  isInitialized(): boolean;
  initialize(): void;

  isLoggedIn(): boolean;
  logIn(username: string, password: string): Promise<ISession>;

  isLoaded(): boolean;

  getCurrentUser(): IUser;
  getCurrentUserPermissions(): IUserPermission[];

  getUser(user: IUser): IUser;
}

export default class Application extends EventEmitter implements IApplication {
  private state: IApplicationState;
  private client: IClient;

  constructor(config: IApplicationConfig) {
    super();

    this.state = {};
    this.client = new Client(config);
  }

  isInitialized() {
    return this.state.isInitialized;
  }

  initialize() {
    let session = this.loadSession();

    if (session) {
      this.state.session = session;
      this.client.session = session;

      this.load();
    }

    this.state.isInitialized = true;
    this.emit('initialize');
  }

  isLoggedIn() {
    return this.state.session !== undefined;
  }

  async logIn(username: string, password: string): Promise<ISession> {
    let session = await this.client.sessions.create(username, password);

    if (session) {
      this.saveSession(session);

      this.client.session = session;
      this.state.session = session;
      this.emit('login', session);

      this.load();
    }

    return session;
  }

  isLoaded() {
    return this.state.isLoaded;
  }

  async load() {
    let [userPermissions, users, projects, itemStates, itemTypes, itemPriorities] = await Promise.all([
      this.client.users.getUserPermissions(this.state.session.user),
      this.client.users.getAll({}),
      this.client.projects.getAll({}),
      this.client.itemStates.getAll({}),
      this.client.itemTypes.getAll({}),
      this.client.itemPriorities.getAll({})
    ]);

    this.state.userPermissions = userPermissions;
    this.state.users = users;
    this.state.projects = projects;
    this.state.itemStates = itemStates;
    this.state.itemTypes = itemTypes;
    this.state.itemPriorities = itemPriorities;
    this.state.isLoaded = true;
    this.emit('load');
  }

  getCurrentUser() {
    return this.state.session.user;
  }

  getCurrentUserPermissions() {
    return this.state.userPermissions;
  }

  getUser(user: IUser) {
    return this.state.users.filter(entityComparer.bind(this, user))[0];
  }

  private loadSession(): ISession {
    let item = localStorage.getItem('session');

    if (!item)
      return undefined;

    return JSON.parse(item);
  }

  private saveSession(session: ISession) {
    localStorage.setItem('session', JSON.stringify(session));
  }
}

export function entityComparer(entity1: IEntity, entity2: IEntity) {
  if (!entity1 || !entity2)
    return false;

  return entity1.id === entity2.id;
}

export *  from '../sdk';
