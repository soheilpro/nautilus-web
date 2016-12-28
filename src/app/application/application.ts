import EventEmitter = require('wolfy87-eventemitter');
import { Client, IClient, IUser, ISession, IUserPermission, IProject, IItemPriority, IItemState, IItemType, IItem } from '../sdk';
import { entityComparer } from './entity-comparer';
import { IApplication } from './iapplication';
import { IIssue } from './iissue';

export interface IApplicationConfig {
  address: string;
}

export interface IApplicationState {
  isInitialized?: boolean;
  session?: ISession;
  isLoaded?: boolean;
  userPermissions?: IUserPermission[];
  users?: IUser[];
  projects?: IProject[];
  itemStates?: IItemState[];
  itemTypes?: IItemType[];
  itemPriorities?: IItemPriority[];
  items?: IItem[];
}

export class Application extends EventEmitter implements IApplication {
  private state: IApplicationState;
  private client: IClient;

  constructor({ address }: IApplicationConfig) {
    super();

    this.state = {};
    this.client = new Client({ address: address });
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
    let [userPermissions, users, projects, itemStates, itemTypes, itemPriorities, items] = await Promise.all([
      this.client.users.getUserPermissions(this.state.session.user),
      this.client.users.getAll({}),
      this.client.projects.getAll({}),
      this.client.itemStates.getAll({}),
      this.client.itemTypes.getAll({}),
      this.client.itemPriorities.getAll({}),
      this.client.items.getAll({})
    ]);

    this.state.userPermissions = userPermissions;
    this.state.users = users;
    this.state.projects = projects;
    this.state.itemStates = itemStates;
    this.state.itemTypes = itemTypes;
    this.state.itemPriorities = itemPriorities;
    this.state.items = items;
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

  getIssues(): Promise<IIssue[]> {
    let issues = this.state.items.filter(item => item.kind === 'issue');

    return Promise.resolve(issues);
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
