function Filters() {
  var idComparer = function(item1, item2) {
    return item1.id === item2.id;
  };

  this.milestones = new DualSet(idComparer);
  this.states = new DualSet(idComparer);
  this.assignedUsers = new DualSet(idComparer);
  this.projects = new DualSet(idComparer);
}

Filters.prototype.clear = function() {
  this.milestones.clear();
  this.states.clear();
  this.assignedUsers.clear();
  this.projects.clear();
};

function DualSet(comparer) {
  this.include = new Set(comparer);
  this.exclude = new Set(comparer);
  var _this = this;

  this.include.add = function(item) {
    Set.prototype.add.call(_this.include, item);
    _this.exclude.remove(item);
  }

  this.exclude.add = function(item) {
    Set.prototype.add.call(_this.exclude, item);
    _this.include.remove(item);
  }
}

DualSet.prototype.clear = function() {
  this.include.clear();
  this.exclude.clear();
};

function Set(comparer) {
  this.items = [];
  this.comparer = comparer;
}

Set.prototype.clear = function() {
  this.items = [];
};

Set.prototype.set = function(item) {
  this.items = [item];
};

Set.prototype.setAll = function(items) {
  this.items = items;
};

Set.prototype.add = function(item) {
  if (!this.has(item))
    this.items.push(item);
};

Set.prototype.remove = function(item) {
  var _this = this;

  this.items = _.reject(this.items, function(_item) {
    return _this.comparer(_item, item);
  });
};

Set.prototype.toggle = function(item, state) {
  if (state)
    this.add(item);
  else
    this.remove(item);
};

Set.prototype.has = function(item) {
  var _this = this;

  return _.some(this.items, function(_item) {
    return _this.comparer(_item, item);
  });
};
