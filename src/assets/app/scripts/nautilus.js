function Nautilus(client) {
  this.client = client;
  this.state = {};
}

Nautilus.prototype = new EventEmitter();
Nautilus.prototype.constructor = EventEmitter;

Nautilus.prototype.init = function() {
  var _this = this;

  async.parallel([
    _this.client.states.getAll.bind(_this, null),
    _this.client.projects.getAll.bind(_this, null),
    _this.client.users.getAll.bind(_this, null),
    _this.client.items.getAll.bind(_this, { type: 'milestone' }),
    _this.client.items.getAll.bind(_this, { type: 'issue' })
  ],
  function(error, results) {
    if (error)
      return _this.emitEvent('error', [error]);

    _this.state.states = results[0];
    _this.state.projects = results[1];
    _this.state.users = results[2];
    _this.state.milestones = results[3];
    _this.state.issues = results[4].map(_this.toItem.bind(_this));

    _this.emitEvent('init');
  });
};

Nautilus.prototype.getStates = function() {
  return this.state.states;
};

Nautilus.prototype.getProjects = function() {
  return this.state.projects;
};

Nautilus.prototype.getUsers = function() {
  return this.state.users;
};

Nautilus.prototype.getMilestones = function() {
  return this.state.milestones;
};

Nautilus.prototype.addMilestone = function(milestone, callback) {
  var _this = this;

  milestone.type = 'milestone';

  this.client.items.insert(milestone, function(error, milestone) {
    if (error) {
      _this.emitEvent('error', [error]);
      return callback(error);
    }

    milestone = _this.toItem(milestone);

    _this.state.milestones.push(milestone);
    _this.emitEvent('milestoneAdded', [milestone]);

    callback(null, milestone);
  });
};

Nautilus.prototype.getIssues = function() {
  return this.state.issues;
};

Nautilus.prototype.updateIssue = function(issue, newValues) {
  var _this = this;

  this.client.items.update(issue, newValues, function(error, issue) {
    if (error)
      return _this.emitEvent('error', [error]);

    issue = _this.toItem(issue);

    _this.state.issues[_this.state.issues.findIndex(idComparer.bind(undefined, issue))] = issue;
    _this.emitEvent('issueChanged', [issue]);
  });
};

Nautilus.prototype.updateIssueMilestone = function(issue, newMilestone) {
  var _this = this;

  var oldMilestone = issue.getMilestone();

  async.parallel([
    function(callback) {
      if (!oldMilestone)
        return callback();

      this.client.items.removeSubItem(oldMilestone, issue, function(error, milestone) {
        if (error)
          return callback(error);

        milestone = _this.toItem(milestone);

        _this.state.milestones[_this.state.milestones.findIndex(idComparer.bind(undefined, milestone))] = milestone;
        _this.emitEvent('milestoneChanged', [milestone]);

        callback();
      });
    },
    function(callback) {
      if (!newMilestone)
        return callback();

      this.client.items.addSubItem(newMilestone, issue, function(error, milestone) {
        if (error)
          return callback(error);

        milestone = _this.toItem(milestone);

        _this.state.milestones[_this.state.milestones.findIndex(idComparer.bind(undefined, milestone))] = milestone;
        _this.emitEvent('milestoneChanged', [milestone]);

        callback();
      });
    }
  ],
  function(error, results) {
    if (error)
      return _this.emitEvent('error', [error]);

      _this.emitEvent('issueChanged', [issue]);
  });
};

Nautilus.prototype.toItem = function(item) {
  item.context = this;
  item.__proto__ = Item.prototype;

  return item;
};

function Item() {
}

Item.prototype.getState = function() {
  var _this = this;

  if (!this.state)
    return;

  return this.context.getStates().find(idComparer.bind(undefined, this.state));
};

Item.prototype.getProject = function() {
  var _this = this;

  if (!this.project)
    return;

  return this.context.getProjects().find(idComparer.bind(undefined, this.project));
};

Item.prototype.getMilestone = function() {
  var _this = this;

  return this.context.getMilestones().find(function(milestone) {
    return _.any(milestone.subItems, idComparer.bind(undefined, _this));
  });
};

Item.prototype.getAssignedUser = function() {
  var _this = this;

  if (!this.assignedUsers || this.assignedUsers.length <= 0)
    return;

  return this.context.getUsers().find(idComparer.bind(undefined, this.assignedUsers[0]));
};

function idComparer(item1, item2) {
  if (!item1 || !item2)
    return false;

  return item1.id === item2.id;
}