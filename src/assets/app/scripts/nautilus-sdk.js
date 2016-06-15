/* Users */
function UsersService(client) {
  this.client = client;
};

UsersService.prototype.getAll = function(filter, callback) {
  var options = {
    path: '/users'
  };

  this.client.invoke(options, callback);
};

/* Projects */
function ProjectsService(client) {
  this.client = client;
};

ProjectsService.prototype.getAll = function(filter, callback) {
  var options = {
    path: '/projects'
  };

  this.client.invoke(options, callback);
};

/* States */
function StatesService(client) {
  this.client = client;
};

StatesService.prototype.getAll = function(filter, callback) {
  var options = {
    path: '/states'
  };

  this.client.invoke(options, callback);
};

/* Items */
function ItemsService(client) {
  this.client = client;
};

ItemsService.prototype.getAll = function(filter, callback) {
  var options = {
    path: '/items',
    params: {
      type: filter.type
    }
  };

  this.client.invoke(options, callback);
};

ItemsService.prototype.update = function(item, changes, callback) {
  function getParam(obj) {
    if (obj === undefined)
      return undefined;

    if (obj === null)
      return '';

    return obj.id
  }

  var options = {
    method: 'PATCH',
    path: '/items/' + item.id,
    params: {
      title: changes.title,
      project_id: getParam(changes.project),
      state_id: getParam(changes.state),
      assigned_user_ids: getParam(changes.assignedUser)
    }
  };

  this.client.invoke(options, callback);
};

ItemsService.prototype.addSubItem = function(item, subItem, callback) {
  var options = {
    method: 'PATCH',
    path: '/items/' + item.id,
    params: {
      add_sub_item_ids: subItem.id
    }
  };

  this.client.invoke(options, callback);
};

ItemsService.prototype.removeSubItem = function(item, subItem, callback) {
  var options = {
    method: 'PATCH',
    path: '/items/' + item.id,
    params: {
      remove_sub_item_ids: subItem.id
    }
  };

  this.client.invoke(options, callback);
};

/* NautilusClient */
function NautilusClient() {
  this.users = new UsersService(this);
  this.projects = new ProjectsService(this);
  this.states = new StatesService(this);
  this.items = new ItemsService(this);
}

NautilusClient.prototype.invoke = function(options, callback) {
  var settings = {
    method: options.method,
    url: this.address + options.path,
    data: options.params,
    headers: {
      Authorization: 'Basic ' + window.btoa(this.accessToken + ':-')
    }
  };

  console.log(settings);

  $.ajax(settings)
    .done(function(data) {
      callback(null, data.data);
    })
    .fail(callback);
}
