import { INautilusClient, IEntity, IUser, ISession, IProject, IState, IItem, IItemChange } from './sdk/nautilus'

declare class EventEmitter {
  emitEvent(evt: string, args?: any[]): void;
  on(evt: string, listener: (...args: any[]) => void): void;
}

interface IExtendedItem extends IItem {
  getTitle(): string;
  getState(): IState;
  getProject(): IProject;
  getMilestone(): IMilestone;
  getAssignedUser(): IUser;
  getCreator(): IUser;
}

export interface IMilestone extends IExtendedItem {
}

export interface IIssue extends IExtendedItem {
  getMilestone(): IMilestone;
}

interface INautilusState {
  isInitialized?: boolean;
  session?: ISession;
  states?: IState[];
  projects?: IProject[];
  users?: IUser[];
  milestones?: IMilestone[];
  issues?: IIssue[];
}

export interface INautilus extends EventEmitter {
  login(username: string, password: string): void;
  init(): void;
  isInitialized(): void;
  getSession(): ISession;
  setSession(session: ISession): void;
  getStates(): IState[];
  getProjects(): IProject[];
  getUsers(): IUser[];
  getMilestones(): IMilestone[];
  addMilestone(milestone: IMilestone): void;
  getIssues(): IIssue[];
  addIssue(issue: IIssue): void;
  updateIssue(issue: IIssue, change: IItemChange): void;
  deleteIssue(issue: IIssue): void;
  updateIssueMilestone(issue: IIssue, newMilestone: IMilestone): void;
}

export class Nautilus extends EventEmitter implements INautilus {
  public static Instance: INautilus;
  private client: INautilusClient;
  private state: INautilusState;

  constructor(client: INautilusClient) {
    super();

    this.client = client;
    this.state = {};
  }

  login(username: string, password: string) {
    this.client.sessions.login(username, password, (error, session) => {
      if (error)
        return this.emitEvent('error', [error]);

      this.emitEvent('login', [session]);
    });
  }

  setSession(session: ISession) {
    this.client.session = session;
    this.state.session = session;
  }

  init() {
    async.parallel([
      this.client.states.getAll.bind(this.client.states, {}),
      this.client.projects.getAll.bind(this.client.projects, {}),
      this.client.users.getAll.bind(this.client.users, {}),
      this.client.items.getAll.bind(this.client.items, { type: 'milestone' }),
      this.client.items.getAll.bind(this.client.items, { type: 'issue' })
    ],
    (error, results) => {
      if (error)
        return this.emitEvent('error', [error]);

      this.state.states = results[0] as IState[];
      this.state.projects = results[1] as IProject[];
      this.state.users = results[2] as IUser[];
      this.state.milestones = (results[3] as []).map(this.toMilestone.bind(this)) as IIssue[];
      this.state.issues = (results[4] as []).map(this.toIssue.bind(this)) as IIssue[];
      this.state.isInitialized = true;

      this.emitEvent('init');
    });
  };

  isInitialized() {
    return this.state.isInitialized;
  }

  getSession() {
    return this.state.session;
  }

  getStates() {
    return this.state.states;
  };

  getProjects() {
    return this.state.projects;
  };

  getUsers() {
    return this.state.users;
  };

  getMilestones() {
    return this.state.milestones;
  };

  addMilestone(milestone: IMilestone) {
    milestone.type = 'milestone';

    this.client.items.insert(milestone, (error, item) => {
      if (error)
        return this.emitEvent('error', [error]);

      var milestone = this.toMilestone(item);

      this.state.milestones.push(milestone);
      this.emitEvent('milestoneAdded', [milestone]);
    });
  };

  getIssues() {
    return this.state.issues;
  };

  addIssue(issue: IIssue) {
    this.client.items.insert(issue, (error, item) => {
      if (error)
        return this.emitEvent('error', [error]);

      var issue = this.toIssue(item);

      this.state.issues.push(issue);
      this.emitEvent('issueAdded', [issue]);
    });
  }

  updateIssue(issue: IIssue, change: IItemChange) {
    this.client.items.update(issue.id, change, (error, item) => {
      if (error)
        return this.emitEvent('error', [error]);

      var issue = this.toIssue(item);

      this.state.issues[_.findIndex(this.state.issues, entityComparer.bind(this, issue))] = issue;
      this.emitEvent('issueChanged', [issue]);
    });
  };

  deleteIssue(issue: IIssue) {
    this.client.items.delete(issue.id, (error) => {
      if (error)
        return this.emitEvent('error', [error]);

      this.state.issues.splice(_.findIndex(this.state.issues, entityComparer.bind(this, issue)), 1);
      this.emitEvent('issueDeleted', [issue]);
    });
  };

  updateIssueMilestone(issue: IIssue, newMilestone: IMilestone) {
    var oldMilestone = issue.getMilestone();

    async.parallel([
      (callback) => {
        if (!oldMilestone)
          return callback();

        var change: IItemChange = {
          subItems_remove: [issue]
        };

        this.client.items.update(oldMilestone.id, change, (error, item) => {
          if (error)
            return callback(error);

          var milestone = this.toMilestone(item);

          this.state.milestones[_.findIndex(this.state.milestones, entityComparer.bind(this, milestone))] = milestone;
          this.emitEvent('milestoneChanged', [milestone]);

          callback();
        });
      },
      (callback) => {
        if (!newMilestone)
          return callback();

        var change: IItemChange = {
          subItems_add: [issue]
        };

        this.client.items.update(newMilestone.id, change, (error, item) => {
          if (error)
            return callback(error);

          var milestone = this.toMilestone(item);

          this.state.milestones[_.findIndex(this.state.milestones, entityComparer.bind(this, milestone))] = milestone;
          this.emitEvent('milestoneChanged', [milestone]);

          callback();
        });
      }
    ],
    (error, results) => {
      if (error)
        return this.emitEvent('error', [error]);

        this.emitEvent('issueChanged', [issue]);
    });
  };

  private toMilestone(item: IItem): IMilestone {
    var milestone = item as any;
    milestone.context = this;
    milestone.__proto__ = Milestone.prototype;

    return milestone;
  };

  private toIssue(item: IItem): IIssue {
    var issue = item as any;
    issue.context = this;
    issue.__proto__ = Issue.prototype;

    return issue;
  };
}

class Item implements IExtendedItem {
  context: INautilus;
  type: string;
  title: string;
  state: IState;
  project: IProject;
  subItems: IItem[];
  assignedUsers: IUser[];
  creator: IUser;

  getTitle() {
    return this.title;
  }

  getState() {
    if (!this.state)
      return;

    return _.find(this.context.getStates(), entityComparer.bind(this, this.state));
  };

  getProject() {
    if (!this.project)
      return;

    return _.find(this.context.getProjects(), entityComparer.bind(this, this.project));
  };

  getMilestone() {
    return _.find(this.context.getMilestones(), (milestone: IMilestone) => {
      return _.any(milestone.subItems, entityComparer.bind(this, this));
    });
  };

  getAssignedUser() {
    if (!this.assignedUsers || this.assignedUsers.length <= 0)
      return;

    return _.find(this.context.getUsers(), entityComparer.bind(this, this.assignedUsers[0]));
  };

  getCreator() {
    return _.find(this.context.getUsers(), entityComparer.bind(this, this.creator));
  };
}

class Milestone extends Item {
}

class Issue extends Item {
}

export function entityComparer(entity1: IEntity, entity2: IEntity) {
  if (!entity1 || !entity2)
    return false;

  return entity1.id === entity2.id;
}

export * from './sdk/nautilus';