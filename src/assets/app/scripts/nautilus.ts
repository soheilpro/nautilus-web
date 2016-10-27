import { INautilusClient, IEntity, IUser, IUserPermission, ISession, IProject, IItemState, IItemType, IItemPriority, IItem, IItemChange, IProjectChange } from './sdk/nautilus'

declare class EventEmitter {
  emitEvent(evt: string, args?: any[]): void;
  on(evt: string, listener: (...args: any[]) => void): void;
}

interface IExtendedItem extends IItem {
  getType(): IItemType;
  getTitle(): string;
  getFullTitle(): string;
  getDescription(): string;
  getState(): IItemState;
  getPriority(): IItemPriority;
  getProject(): IProject;
  getMilestone(): IMilestone;
  getTags(): string[];
  getParent(): IExtendedItem;
  getParents(): IExtendedItem[];
  getAssignedTo(): IUser;
  getCreatedBy(): IUser;
  getModifiedBy(): IUser;
}

export interface IMilestone extends IExtendedItem {
}

export interface IIssue extends IExtendedItem {
}

export interface ITask extends IExtendedItem {
}

interface INautilusState {
  isInitialized?: boolean;
  session?: ISession;
  permissions?: IUserPermission[];
  itemStates?: IItemState[];
  milestoneStates?: IItemState[];
  issueStates?: IItemState[];
  taskStates?: IItemState[];
  itemTypes?: IItemType[];
  milestoneTypes?: IItemType[];
  issueTypes?: IItemType[];
  taskTypes?: IItemType[];
  itemPriorities?: IItemPriority[];
  projects?: IProject[];
  users?: IUser[];
  milestones?: IMilestone[];
  issues?: IIssue[];
  tasks?: ITask[];
}

export interface INautilus extends EventEmitter {
  login(username: string, password: string): void;
  init(): void;
  refresh(): void;
  isInitialized(): void;
  getSession(): ISession;
  setSession(session: ISession): void;
  getPermissions(): IUserPermission[];
  getMilestoneStates(): IItemState[];
  getMilestoneStateById(id: string): IItemState;
  getMilestoneStateByTitle(title: string): IItemState;
  getIssueStates(): IItemState[];
  getIssueStateById(id: string): IItemState;
  getIssueStateByTitle(title: string): IItemState;
  getItemStates(): IItemState[];
  getItemStateById(id: string): IItemState;
  getItemStateByTitle(title: string): IItemState;
  getTaskStates(): IItemState[];
  getTaskStateById(id: string): IItemState;
  getTaskStateByTitle(title: string): IItemState;
  getMilestoneTypes(): IItemType[];
  getMilestoneTypeById(id: string): IItemType;
  getMilestoneTypeByTitle(title: string): IItemType;
  getItemTypes(): IItemType[];
  getItemTypeById(id: string): IItemType;
  getItemTypeByTitle(title: string): IItemType;
  getIssueTypes(): IItemType[];
  getIssueTypeById(id: string): IItemType;
  getIssueTypeByTitle(title: string): IItemType;
  getTaskTypes(): IItemType[];
  getTaskTypeById(id: string): IItemType;
  getTaskTypeByTitle(title: string): IItemType;
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
  getTasks(): ITask[];
  addTask(task: ITask): void;
  updateTask(task: ITask, change: IItemChange): void;
  deleteTask(task: ITask): void;
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

      this.state.milestoneStates = this.state.itemStates.filter(itemState => itemState.itemKind === 'milestone');
      this.state.issueStates = this.state.itemStates.filter(itemState => itemState.itemKind === 'issue');
      this.state.taskStates = this.state.itemStates.filter(itemState => itemState.itemKind === 'task');

      this.state.milestoneTypes = this.state.itemTypes.filter(itemType => itemType.itemKind === 'milestone');
      this.state.issueTypes = this.state.itemTypes.filter(itemType => itemType.itemKind === 'issue');
      this.state.taskTypes = this.state.itemTypes.filter(itemType => itemType.itemKind === 'task');

      this.client.items.getAll({}, (error, items) => {
        if (error)
          return callback(error);
        
        var milestones = items.filter(item => item.kind === 'milestone');
        var issues = items.filter(item => item.kind === 'issue');
        var tasks = items.filter(item => item.kind === 'task');

        this.state.milestones = _.sortBy(milestones.map(this.toMilestone.bind(this)) as IMilestone[], x => x.getFullTitle());
        this.state.issues = issues.map(this.toIssue.bind(this)) as IIssue[];
        this.state.tasks = tasks.map(this.toTask.bind(this)) as ITask[];
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

  getMilestoneStates() {
    return this.state.milestoneStates;
  };

  getMilestoneStateById(id: string) {
    return this.state.milestoneStates.filter(x => x.id === id)[0];
  }

  getMilestoneStateByTitle(title: string) {
    return this.state.milestoneStates.filter(x => x.title === title)[0];
  }

  getIssueStates() {
    return this.state.issueStates;
  };

  getIssueStateById(id: string) {
    return this.state.issueStates.filter(x => x.id === id)[0];
  }

  getIssueStateByTitle(title: string) {
    return this.state.issueStates.filter(x => x.title === title)[0];
  }

  getTaskStates() {
    return this.state.taskStates;
  };

  getTaskStateById(id: string) {
    return this.state.taskStates.filter(x => x.id === id)[0];
  }

  getTaskStateByTitle(title: string) {
    return this.state.taskStates.filter(x => x.title === title)[0];
  }

  getItemTypes() {
    return this.state.itemTypes;
  };

  getItemTypeById(id: string): IItemType {
    return this.state.itemTypes.filter(x => x.id === id)[0];
  }

  getItemTypeByTitle(title: string): IItemType {
    return this.state.itemTypes.filter(x => x.title === title)[0];
  }

  getMilestoneTypes() {
    return this.state.milestoneTypes;
  };

  getMilestoneTypeById(id: string): IItemType {
    return this.state.milestoneTypes.filter(x => x.id === id)[0];
  }

  getMilestoneTypeByTitle(title: string): IItemType {
    return this.state.milestoneTypes.filter(x => x.title === title)[0];
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

  getTaskTypes() {
    return this.state.taskTypes;
  };

  getTaskTypeById(id: string): IItemType {
    return this.state.taskTypes.filter(x => x.id === id)[0];
  }

  getTaskTypeByTitle(title: string): IItemType {
    return this.state.taskTypes.filter(x => x.title === title)[0];
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
    milestone.kind = 'milestone';

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
    issue.kind = 'issue';

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

  getTasks() {
    return this.state.tasks;
  };

  addTask(task: ITask) {
    task.kind = 'task';

    this.client.items.insert(task, (error, item) => {
      if (error)
        return this.emitEvent('error', [error]);

      var task = this.toTask(item);

      this.state.tasks.push(task);
      this.emitEvent('taskAdded', [task]);
    });
  }

  updateTask(task: ITask, change: IItemChange) {
    this.client.items.update(task.id, change, (error, item) => {
      if (error)
        return this.emitEvent('error', [error]);

      var task = this.toTask(item);

      this.state.tasks[_.findIndex(this.state.tasks, entityComparer.bind(this, task))] = task;
      this.emitEvent('taskChanged', [task]);
    });
  };

  deleteTask(task: ITask) {
    this.client.items.delete(task.id, (error) => {
      if (error)
        return this.emitEvent('error', [error]);

      this.state.tasks.splice(_.findIndex(this.state.tasks, entityComparer.bind(this, task)), 1);
      this.emitEvent('taskDeleted', [task]);
    });
  };

  private toExtendedItem(item: IItem): IExtendedItem {
    var exntendedItem = item as any;
    exntendedItem.context = this;
    exntendedItem.__proto__ = ExtendedItem.prototype;

    return exntendedItem;
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

  private toTask(item: IItem): ITask {
    var issue = item as any;
    issue.context = this;
    issue.__proto__ = Task.prototype;

    return issue;
  };
}

class ExtendedItem implements IExtendedItem {
  sid: string;
  context: INautilus;
  type: IItemType;
  title: string;
  description: string;
  state: IItemState;
  priority: IItemPriority;
  tags: string[];
  project: IProject;
  parent: IItem;
  assignedTo: IUser;
  createdBy: IUser;
  modifiedBy: IUser;

  getType(): IItemType {
    throw new Error('NotSupportedException');
  };

  getTitle() {
    return this.title;
  }

  getFullTitle() {
    var project = this.getProject();

    if (!project)
      return this.title;

    return `${project.name}:‌ ${this.title}`;
  }

  getDescription() {
    return this.description;
  }

  getState(): IItemState {
    throw new Error('NotSupportedException');
  };

  getPriority() {
    if (!this.priority)
      return undefined;

    return _.find(this.context.getItemPriorities(), entityComparer.bind(this, this.priority));
  };

  getProject() {
    if (!this.project)
      return undefined;

    return _.find(this.context.getProjects(), entityComparer.bind(this, this.project));
  };

  getMilestone() {
    if (!this.parent)
      return undefined;

    return _.find(this.context.getMilestones(), entityComparer.bind(this, this.parent));
  };

  getTags() {
    return this.tags;
  }

  getParent() {
    if (!this.parent)
      return undefined;

    return _.find(this.context.getMilestones(), entityComparer.bind(this, this.parent)) ||
           _.find(this.context.getIssues(), entityComparer.bind(this, this.parent));
  }

  getParents() {
    var parents: IExtendedItem[] = [];
    var parent = this.getParent();

    while (parent) {
      parents.push(parent);
      parent = parent.getParent();
    }

    return parents;
  }

  getAssignedTo() {
    if (!this.assignedTo)
      return undefined;

    return _.find(this.context.getUsers(), entityComparer.bind(this, this.assignedTo));
  };

  getCreatedBy() {
    return _.find(this.context.getUsers(), entityComparer.bind(this, this.createdBy));
  };

  getModifiedBy() {
    return _.find(this.context.getUsers(), entityComparer.bind(this, this.modifiedBy));
  };
}

class Milestone extends ExtendedItem {
  getType() {
    if (!this.type)
      return undefined;

    return _.find(this.context.getMilestoneTypes(), entityComparer.bind(this, this.type));
  };

  getState() {
    if (!this.state)
      return undefined;

    return _.find(this.context.getMilestoneStates(), entityComparer.bind(this, this.state));
  };
}

class Issue extends ExtendedItem {
  getType() {
    if (!this.type)
      return undefined;

    return _.find(this.context.getIssueTypes(), entityComparer.bind(this, this.type));
  };

  getState() {
    if (!this.state)
      return undefined;

    return _.find(this.context.getIssueStates(), entityComparer.bind(this, this.state));
  };
}

class Task extends ExtendedItem {
  getType() {
    if (!this.type)
      return undefined;

    return _.find(this.context.getTaskTypes(), entityComparer.bind(this, this.type));
  };

  getState() {
    if (!this.state)
      return undefined;

    return _.find(this.context.getTaskStates(), entityComparer.bind(this, this.state));
  };
}

export function entityComparer(entity1: IEntity, entity2: IEntity) {
  if (!entity1 || !entity2)
    return false;

  return entity1.id === entity2.id;
}

export function asEntity(entity: IEntity) {
  if (!entity)
    return undefined;

  return {
    id: entity.id
  };
}

export * from './sdk/nautilus';
