import { INautilusClient, IEntity, IUser, ISession, IProject, IItemState, IItemType, IItemArea, IItemPriority, IItem, IItemChange } from './sdk/nautilus'

declare class EventEmitter {
  emitEvent(evt: string, args?: any[]): void;
  on(evt: string, listener: (...args: any[]) => void): void;
}

interface IExtendedItem extends IItem {
  getType(): IItemType;
  getTitle(): string;
  getDescription(): string;
  getState(): IItemState;
  getPriority(): IItemPriority;
  getProject(): IProject;
  getArea(): IItemArea;
  getMilestone(): IMilestone;
  getAssignedUser(): IUser;
  getCreator(): IUser;
  isNew: boolean;
  isUpdated: boolean;
}

export interface IMilestone extends IExtendedItem {
}

export interface IIssue extends IExtendedItem {
  getMilestone(): IMilestone;
}

interface INautilusState {
  isInitialized?: boolean;
  session?: ISession;
  itemStates?: IItemState[];
  itemTypes?: IItemType[];
  itemAreas?: IItemArea[];
  milestoneType?: IItemType;
  issueTypes?: IItemType[];
  itemPriorities?: IItemPriority[];
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
  getItemStates(): IItemState[];
  getIssueTypes(): IItemType[];
  getItemAreas(): IItemArea[];
  getItemPriorities(): IItemPriority[];
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

  emitEvent(evt: string, args?: any[]) {
    log.debug('Nautilus:', evt, args);
    super.emitEvent(evt, args);
  }

  login(username: string, password: string) {
    this.client.sessions.login(username, password, (error, session) => {
      if (error)
        return this.emitEvent('error', [error]);

      if (!session)
        return;

      this.emitEvent('login', [session]);
    });
  }

  setSession(session: ISession) {
    this.client.session = session;
    this.state.session = session;
  }

  init() {
    async.parallel([
      this.client.itemStates.getAll.bind(this.client.itemStates, {}),
      this.client.itemTypes.getAll.bind(this.client.itemTypes, {}),
      this.client.itemAreas.getAll.bind(this.client.itemAreas, {}),
      this.client.itemPriorities.getAll.bind(this.client.itemPriorities, {}),
      this.client.projects.getAll.bind(this.client.projects, {}),
      this.client.users.getAll.bind(this.client.users, {}),
    ],
    (error, results) => {
      if (error)
        return this.emitEvent('error', [error]);

      this.state.itemStates = results[0] as IItemState[];
      this.state.itemTypes = results[1] as IItemType[];
      this.state.itemAreas = results[2] as IItemArea[];
      this.state.itemPriorities = results[3] as IItemPriority[];
      this.state.projects = results[4] as IProject[];
      this.state.users = results[5] as IUser[];

      this.state.milestoneType = _.find(this.state.itemTypes, itemType => itemType.key === 'milestone');
      this.state.issueTypes = this.state.itemTypes.filter(itemType => /issue\:/.test(itemType.key));

      this.client.items.getAll({}, (error, items) => {
        if (error)
          return this.emitEvent('error', [error]);

        var milestones = items.filter(item => entityComparer(item.type, this.state.milestoneType));
        var issues = items.filter(item => !item.type || this.state.issueTypes.some(issueType => entityComparer(item.type, issueType)));

        this.state.milestones = milestones.map(this.toMilestone.bind(this)) as IMilestone[];
        this.state.issues = issues.map(this.toIssue.bind(this)) as IIssue[];
        this.state.isInitialized = true;

        this.emitEvent('init');
      });
    });
  };

  isInitialized() {
    return this.state.isInitialized;
  }

  getSession() {
    return this.state.session;
  }

  getItemStates() {
    return this.state.itemStates;
  };

  getIssueTypes() {
    return this.state.issueTypes;
  };

  getItemAreas() {
    return this.state.itemAreas;
  };

  getItemPriorities() {
    return this.state.itemPriorities;
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
      issue.isNew = true;

      this.state.issues.push(issue);
      this.emitEvent('issueAdded', [issue]);
    });
  }

  updateIssue(issue: IIssue, change: IItemChange) {
    this.client.items.update(issue.id, change, (error, item) => {
      if (error)
        return this.emitEvent('error', [error]);

      var issue = this.toIssue(item);
      issue.isUpdated = true;

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
  sid: string;
  context: INautilus;
  type: IItemType;
  title: string;
  description: string;
  state: IItemState;
  priority: IItemPriority;
  project: IProject;
  area: IItemArea;
  subItems: IItem[];
  assignedUsers: IUser[];
  creator: IUser;
  isNew: boolean;
  isUpdated: boolean;

  getType() {
    if (!this.type)
      return;

    return _.find(this.context.getIssueTypes(), entityComparer.bind(this, this.type));
  };

  getTitle() {
    return this.title;
  }

  getDescription() {
    return this.description;
  }

  getState() {
    if (!this.state)
      return;

    return _.find(this.context.getItemStates(), entityComparer.bind(this, this.state));
  };

  getPriority() {
    if (!this.priority)
      return;

    return _.find(this.context.getItemPriorities(), entityComparer.bind(this, this.priority));
  };

  getProject() {
    if (!this.project)
      return;

    return _.find(this.context.getProjects(), entityComparer.bind(this, this.project));
  };

  getArea() {
    if (!this.area)
      return;

    return _.find(this.context.getItemAreas(), entityComparer.bind(this, this.area));
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