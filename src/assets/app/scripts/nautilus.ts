declare class EventEmitter {
  emitEvent(evt, args?);
  on(evt, listener);
}

export class Nautilus extends EventEmitter {
  public static Instance;
  private client;
  private state;

  constructor(client) {
    super();

    this.client = client;
    this.state = {};
  }

  init() {
    async.parallel([
      this.client.states.getAll.bind(this, null),
      this.client.projects.getAll.bind(this, null),
      this.client.users.getAll.bind(this, null),
      this.client.items.getAll.bind(this, { type: 'milestone' }),
      this.client.items.getAll.bind(this, { type: 'issue' })
    ],
    (error, results) => {
      if (error)
        return this.emitEvent('error', [error]);

      this.state.states = results[0];
      this.state.projects = results[1];
      this.state.users = results[2];
      this.state.milestones = results[3];
      this.state.issues = (results[4] as any).map(this.toItem.bind(this));

      this.emitEvent('init');
    });
  };

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

  addMilestone(milestone, callback) {
    milestone.type = 'milestone';

    this.client.items.insert(milestone, (error, milestone) => {
      if (error) {
        this.emitEvent('error', [error]);
        return callback(error);
      }

      milestone = this.toItem(milestone);

      this.state.milestones.push(milestone);
      this.emitEvent('milestoneAdded', [milestone]);

      callback(null, milestone);
    });
  };

  getIssues() {
    return this.state.issues;
  };

  addIssue(issue) {
    this.client.items.insert(issue, (error, issue) => {
      if (error)
        return this.emitEvent('error', [error]);

      issue = this.toItem(issue);

      this.state.issues.push(issue);
      this.emitEvent('issueAdded', [issue]);
    });
  }

  updateIssue(issue, newValues) {
    this.client.items.update(issue, newValues, (error, issue) => {
      if (error)
        return this.emitEvent('error', [error]);

      issue = this.toItem(issue);

      this.state.issues[this.state.issues.findIndex(idComparer.bind(this, issue))] = issue;
      this.emitEvent('issueChanged', [issue]);
    });
  };

  updateIssueMilestone(issue, newMilestone) {
    var oldMilestone = issue.getMilestone();

    async.parallel([
      (callback) => {
        if (!oldMilestone)
          return callback();

        this.client.items.removeSubItem(oldMilestone, issue, (error, milestone) => {
          if (error)
            return callback(error);

          milestone = this.toItem(milestone);

          this.state.milestones[this.state.milestones.findIndex(idComparer.bind(this, milestone))] = milestone;
          this.emitEvent('milestoneChanged', [milestone]);

          callback();
        });
      },
      (callback) => {
        if (!newMilestone)
          return callback();

        this.client.items.addSubItem(newMilestone, issue, (error, milestone) => {
          if (error)
            return callback(error);

          milestone = this.toItem(milestone);

          this.state.milestones[this.state.milestones.findIndex(idComparer.bind(this, milestone))] = milestone;
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

  toItem(item) {
    item.context = this;
    item.__proto__ = Item.prototype;

    return item;
  };
}

class Item {
  private context;
  private title;
  private state;
  private project;
  private assignedUsers;

  getTitle() {
    return this.title;
  }

  getState() {
    if (!this.state)
      return;

    return this.context.getStates().find(idComparer.bind(this, this.state));
  };

  getProject() {
    if (!this.project)
      return;

    return this.context.getProjects().find(idComparer.bind(this, this.project));
  };

  getMilestone() {
    return this.context.getMilestones().find((milestone) => {
      return _.any(milestone.subItems, idComparer.bind(this, this));
    });
  };

  getAssignedUser() {
    if (!this.assignedUsers || this.assignedUsers.length <= 0)
      return;

    return this.context.getUsers().find(idComparer.bind(this, this.assignedUsers[0]));
  };
}

function idComparer(item1, item2) {
  if (!item1 || !item2)
    return false;

  return item1.id === item2.id;
}