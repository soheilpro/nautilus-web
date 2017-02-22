import EventEmitter = require('wolfy87-eventemitter');
import { Client, IClient, ISession } from '../sdk';
import { IApplication } from './iapplication';
import { IItemModule, ItemModule } from './item';
import { IIssuePriorityModule, IssuePriorityModule } from './issue-priority';
import { IIssueStateModule, IssueStateModule } from './issue-state';
import { IIssueTypeModule, IssueTypeModule } from './issue-type';
import { ITaskStateModule, TaskStateModule } from './task-state';
import { ITaskTypeModule, TaskTypeModule } from './task-type';
import { IProjectModule, ProjectModule } from './project';
import { IUserModule, UserModule } from './user';

export interface IApplicationConfig {
  address: string;
}

export class Application extends EventEmitter implements IApplication {
  private client: IClient;
  private session: ISession;
  private isInitializedState: boolean;
  private isLoadedState: boolean;

  users: IUserModule;
  projects: IProjectModule;
  items: IItemModule;
  issuePriorities: IIssuePriorityModule;
  issueStates: IIssueStateModule;
  issueTypes: IIssueTypeModule;
  taskStates: ITaskStateModule;
  taskTypes: ITaskTypeModule;

  constructor({ address }: IApplicationConfig) {
    super();

    let client = new Client({ address: address });

    this.client = client;
    this.users = new UserModule(this, client);
    this.projects = new ProjectModule(this, client);
    this.items = new ItemModule(this, client);
    this.issuePriorities = new IssuePriorityModule(this, client);
    this.issueStates = new IssueStateModule(this, client);
    this.issueTypes = new IssueTypeModule(this, client);
    this.taskStates = new TaskStateModule(this, client);
    this.taskTypes = new TaskTypeModule(this, client);
  }

  isInitialized() {
    return this.isInitializedState;
  }

  initialize() {
    let session = this.loadSession();

    if (session) {
      this.session = session;
      this.client.session = session;

      this.load();
    }

    this.isInitializedState = true;
    this.emit('initialize');
  }

  isLoggedIn() {
    return !!this.session;
  }

  async logIn(username: string, password: string): Promise<ISession> {
    let session = await this.client.sessions.create(username, password);

    if (session) {
      this.saveSession(session);

      this.session = session;
      this.client.session = session;
      this.emit('login');

      this.load();
    }

    return session;
  }

  getSession() {
    return this.session;
  }

  isLoaded() {
    return this.isLoadedState;
  }

  async load() {
    await Promise.all([
      this.users.load(),
      this.projects.load(),
      this.items.load(),
      this.issuePriorities.load(),
      this.issueStates.load(),
      this.issueTypes.load(),
      this.taskStates.load(),
      this.taskTypes.load(),
    ]);

    this.isLoadedState = true;

    this.emit('load');
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
