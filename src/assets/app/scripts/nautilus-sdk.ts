class UsersService {
  private client;

  constructor(client) {
    this.client = client;
  };

  getAll(filter, callback) {
    var options = {
      path: '/users'
    };

    this.client.invoke(options, callback);
  };
}

class ProjectsService {
  private client;

  constructor(client) {
    this.client = client;
  };

  getAll(filter, callback) {
    var options = {
      path: '/projects'
    };

    this.client.invoke(options, callback);
  };
}

class StatesService {
  private client;

  constructor(client) {
    this.client = client;
  };

  getAll(filter, callback) {
    var options = {
      path: '/states'
    };

    this.client.invoke(options, callback);
  };
}

class ItemsService {
  private client;

  constructor(client) {
    this.client = client;
  };

  getAll(filter, callback) {
    var options = {
      path: '/items',
      params: {
        type: filter.type
      }
    };

    this.client.invoke(options, callback);
  };

  insert(item, callback) {
    var options = {
      method: 'POST',
      path: '/items/',
    };

    this.client.invoke(options, callback);
  };

  update(item, changes, callback) {
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

  addSubItem(item, subItem, callback) {
    var options = {
      method: 'PATCH',
      path: '/items/' + item.id,
      params: {
        add_sub_item_ids: subItem.id
      }
    };

    this.client.invoke(options, callback);
  };

  removeSubItem(item, subItem, callback) {
    var options = {
      method: 'PATCH',
      path: '/items/' + item.id,
      params: {
        remove_sub_item_ids: subItem.id
      }
    };

    this.client.invoke(options, callback);
  };
}

export class NautilusClient {
  private address;
  private accessToken;
  private users;
  private projects;
  private states;
  private items;

  constructor(address, accessToken) {
    this.address = address;
    this.accessToken = accessToken;
    this.users = new UsersService(this);
    this.projects = new ProjectsService(this);
    this.states = new StatesService(this);
    this.items = new ItemsService(this);
  }

  invoke(options, callback) {
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
      .done((data) => {
        callback(null, data.data);
      })
      .fail((jqXHR, textStatus, error) => {
        callback(error);
      });
  }
}
