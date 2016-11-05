import { INautilusClient, IEntity, IUser, IUserPermission, ISession, IProject, IItemState, IItemType, IItemPriority, IItem, IItemChange, IProjectChange } from './sdk/nautilus'

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
  getAssignedTo(): IUser;
  getCreator(): IUser;
}

export interface IMilestone extends IExtendedItem {
  getFullTitle(): string;
}

export interface IIssue extends IExtendedItem {
  getMilestone(): IMilestone;
  getParent(): IIssue;
  getParents(): IIssue[];
}

interface INautilusState {
  isInitialized?: boolean;
  session?: ISession;
  permissions?: IUserPermission[];
  itemStates?: IItemState[];
  itemTypes?: IItemType[];
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
  refresh(): void;
  isInitialized(): void;
  getSession(): ISession;
  setSession(session: ISession): void;
  getPermissions(): IUserPermission[];
  getItemStates(): IItemState[];
  getItemStateById(id: string): IItemState;
  getItemStateByTitle(title: string): IItemState;
  getIssueTypes(): IItemType[];
  getIssueTypeById(id: string): IItemType;
  getIssueTypeByTitle(title: string): IItemType;
  getItemPriorities(): IItemPriority[];
  getItemPriorityById(id: string): IItemPriority;
  getItemPriorityByTitle(title: string): IItemPriority;
  getProjects(): IProject[];
  getProjectById(id: string): IProject;
  getProjectByName(name: string): IProject;
  addProject(project: IProject): void;
  updateProject(project: IProject, change: IProjectChange): void;
  deleteProject(project: IProject): void;
  getUsers(): IUser[];
  getUserById(id: string): IUser;
  getUserByName(name: string): IUser;
  getMilestones(): IMilestone[];
  getMilestoneById(id: string): IMilestone;
  getMilestoneByTitle(title: string): IMilestone;
  addMilestone(milestone: IMilestone): void;
  updateMilestone(milestone: IMilestone, change: IItemChange): void;
  deleteMilestone(milestone: IMilestone): void;
  getIssues(): IIssue[];
  addIssue(issue: IIssue): void;
  updateIssue(issue: IIssue, change: IItemChange): void;
  deleteIssue(issue: IIssue): void;
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
    this.load((error) => {
      if (error)
        return this.emitEvent('error', [error]);

      this.emitEvent('init');
    });
  };

  refresh() {
    this.load((error) => {
      if (error)
        return this.emitEvent('error', [error]);

      this.emitEvent('refresh');
    });
  };

  load(callback: (error: Error) => void) {
    async.parallel([
      this.client.itemStates.getAll.bind(this.client.itemStates, {}),
      this.client.itemTypes.getAll.bind(this.client.itemTypes, {}),
      this.client.itemPriorities.getAll.bind(this.client.itemPriorities, {}),
      this.client.projects.getAll.bind(this.client.projects, {}),
      this.client.users.getAll.bind(this.client.users, {}),
      this.client.users.getUserPermissions.bind(this.client.users, this.client.session.user),
    ],
    (error, results) => {
      if (error)
        return callback(error);

      this.state.itemStates = results[0] as IItemState[];
      this.state.itemTypes = _.sortBy(results[1] as IItemType[], x => x.title);
      this.state.itemPriorities = results[2] as IItemPriority[];
      this.state.projects = _.sortBy(results[3] as IProject[], x => x.name);
      this.state.users = _.sortBy(results[4] as IUser[], x => x.name);
      this.state.permissions = results[5] as IUserPermission[];

      this.state.milestoneType = _.find(this.state.itemTypes, itemType => itemType.key === 'milestone');
      this.state.issueTypes = this.state.itemTypes.filter(itemType => /issue\:/.test(itemType.key));

      this.client.items.getAll({}, (error, items) => {
        if (error)
          return callback(error);

        var milestones = items.filter(item => entityComparer(item.type, this.state.milestoneType));
        var issues = items.filter(item => !item.type || this.state.issueTypes.some(issueType => entityComparer(item.type, issueType)));

        this.state.milestones = _.sortBy(milestones.map(this.toMilestone.bind(this)) as IMilestone[], x => x.getFullTitle());
        this.state.issues = issues.map(this.toIssue.bind(this)) as IIssue[];
        this.state.isInitialized = true;

        callback(null);
      });
    });
  };

  isInitialized() {
    return this.state.isInitialized;
  }

  getSession() {
    return this.state.session;
  }

  getPermissions() {
    return this.state.permissions;
  }

  getItemStates() {
    return this.state.itemStates;
  };

  getItemStateById(id: string) {
    return this.state.itemStates.filter(x => x.id === id)[0];
  }

  getItemStateByTitle(title: string) {
    return this.state.itemStates.filter(x => x.title === title)[0];
  }

  getIssueTypes() {
    return this.state.issueTypes;
  };

  getIssueTypeById(id: string): IItemType {
    return this.state.issueTypes.filter(x => x.id === id)[0];
  }

  getIssueTypeByTitle(title: string): IItemType {
    return this.state.issueTypes.filter(x => x.title === title)[0];
  }

  getItemPriorities() {
    return this.state.itemPriorities;
  };

  getItemPriorityById(id: string) {
    return this.state.itemPriorities.filter(x => x.id === id)[0];
  }

  getItemPriorityByTitle(title: string) {
    return this.state.itemPriorities.filter(x => x.title === title)[0];
  }

  getProjects() {
    return this.state.projects;
  };

  getProjectById(id: string): IProject {
    return this.state.projects.filter(x => x.id === id)[0];
  }

  getProjectByName(name: string): IProject {
    return this.state.projects.filter(x => x.name === name)[0];
  }

  addProject(project: IProject) {
    this.client.projects.insert(project, (error, project) => {
      if (error)
        return this.emitEvent('error', [error]);

      this.state.projects.push(project);
      this.emitEvent('projectAdded', [project]);
    });
  };

  updateProject(project: IProject, change: IItemChange) {
    this.client.projects.update(project.id, change, (error, project) => {
      if (error)
        return this.emitEvent('error', [error]);

      this.state.projects[_.findIndex(this.state.projects, entityComparer.bind(this, project))] = project;
      this.emitEvent('projectChanged', [project]);
    });
  };

  deleteProject(project: IProject) {
    this.client.projects.delete(project.id, (error) => {
      if (error)
        return this.emitEvent('error', [error]);

      this.state.projects.splice(_.findIndex(this.state.projects, entityComparer.bind(this, project)), 1);
      this.emitEvent('projectDeleted', [project]);
    });
  };

  getUsers() {
    return this.state.users;
  };

  getUserById(id: string) {
    return this.state.users.filter(x => x.id === id)[0];
  }

  getUserByName(name: string) {
    return this.state.users.filter(x => x.name === name)[0];
  }

  getMilestones() {
    return this.state.milestones;
  };

  getMilestoneById(id: string): IMilestone {
    return this.state.milestones.filter(x => x.id === id)[0];
  }

  getMilestoneByTitle(title: string): IMilestone {
    return this.state.milestones.filter(x => x.title === title)[0];
  }

  addMilestone(milestone: IMilestone) {
    milestone.type = this.state.milestoneType;

    this.client.items.insert(milestone, (error, item) => {
      if (error)
        return this.emitEvent('error', [error]);

      var milestone = this.toMilestone(item);

      this.state.milestones.push(milestone);
      this.emitEvent('milestoneAdded', [milestone]);
    });
  };

  updateMilestone(milestone: IMilestone, change: IItemChange) {
    this.client.items.update(milestone.id, change, (error, item) => {
      if (error)
        return this.emitEvent('error', [error]);

      var milestone = this.toMilestone(item);

      this.state.milestones[_.findIndex(this.state.milestones, entityComparer.bind(this, milestone))] = milestone;
      this.emitEvent('milestoneChanged', [milestone]);
    });
  };

  deleteMilestone(milestone: IMilestone) {
    this.client.items.delete(milestone.id, (error) => {
      if (error)
        return this.emitEvent('error', [error]);

      this.state.milestones.splice(_.findIndex(this.state.milestones, entityComparer.bind(this, milestone)), 1);
      this.emitEvent('milestoneDeleted', [milestone]);
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
    issue.getParent = _.memoize(issue.getParent.bind(issue));

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
  parent: IItem;
  assignedTo: IUser;
  creator: IUser;

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

  getMilestone() {
    if (!this.parent)
      return;

    return _.find(this.context.getMilestones(), entityComparer.bind(this, this.parent));
  };

  getAssignedTo() {
    if (!this.assignedTo)
      return;

    return _.find(this.context.getUsers(), entityComparer.bind(this, this.assignedTo));
  };

  getCreator() {
    return _.find(this.context.getUsers(), entityComparer.bind(this, this.creator));
  };
}

class Milestone extends Item {
  getFullTitle() {
    var project = this.getProject();

    if (!project)
      return this.title;

    return `${project.name}:‌ ${this.title}`;
  }
}

class Issue extends Item {
  getParent() {
    if (!this.parent)
      return;

    return _.find(this.context.getIssues(), entityComparer.bind(this, this.parent));
  }

  getParents() {
    var parents: IIssue[] = [];
    var parent = this.getParent();

    while (parent) {
      parents.push(parent);
      parent = parent.getParent();
    }

    return parents;
  }
}

export function entityComparer(entity1: IEntity, entity2: IEntity) {
  if (!entity1 || !entity2)
    return false;

  return entity1.id === entity2.id;
}

export function asEntity(entity: IEntity) {
  if (!entity)
    return;

  return {
    id: entity.id
  };
}

export * from './sdk/nautilus';