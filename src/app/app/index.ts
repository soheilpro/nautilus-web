import { IClient, ISession } from '../sdk';
import EventEmitter = require('wolfy87-eventemitter');

interface IApplicationState {
  isInitialized?: boolean;
  session?: ISession;
  isLoaded?: boolean;
}

export interface IApplication extends EventEmitter {
  initialize(): void;
  isInitialized(): boolean;

  getSession(): ISession;
  createSession(username: string, password: string): Promise<ISession>;

  load(): void;
  isLoaded(): boolean;
}

export default class Application extends EventEmitter implements IApplication {
  public static Instance: IApplication;
  private state: IApplicationState;
  private client: IClient;

  constructor(client: IClient) {
    super();

    this.state = {};
    this.client = client;
  }

  initialize() {
    let session = this.loadSession();

    if (session) {
      this.state.session = session;
      this.client.session = session;
      this.load();
    }

    this.state.isInitialized = true;
    this.emit('initialized');
  }

  isInitialized() {
    return this.state.isInitialized;
  }

  getSession() {
    return this.state.session;
  }

  async createSession(username: string, password: string): Promise<ISession> {
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

  async load() {
    let [users, userPermissions, projects, itemStates, itemTypes, itemPriorities] = await Promise.all([
      this.client.users.getAll({}),
      this.client.users.getUserPermissions(this.state.session.user),
      this.client.projects.getAll({}),
      this.client.itemStates.getAll({}),
      this.client.itemTypes.getAll({}),
      this.client.itemPriorities.getAll({})
    ]);

    this.state.isLoaded = true;
    this.emit('loaded');
  }

  isLoaded() {
    return this.state.isLoaded;
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
