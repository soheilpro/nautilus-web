var request = require('request');
var _ = require('underscore');

function UsersService(client) {
  this.client = client;
};

UsersService.prototype.getAll = function(options, callback) {
  var options = {
    path: '/users'
  };

  this.client.invoke(options, callback);
};

function ProjectsService(client) {
  this.client = client;
};

ProjectsService.prototype.getAll = function(options, callback) {
  var options = {
    path: '/projects'
  };

  this.client.invoke(options, callback);
};

function StatesService(client) {
  this.client = client;
};

StatesService.prototype.getAll = function(options, callback) {
  var options = {
    path: '/states'
  };

  this.client.invoke(options, callback);
};

function ItemsService(client) {
  this.client = client;
};

ItemsService.prototype.getAll = function(options, callback) {
  var type = options.type;

  var options = {
    path: '/items'
  };

  this.client.invoke(options, function(error, data) {
    if (error)
      return callback(error);

    data = _.where(data, { type: type });

    callback(null, data);
  });
};

function Client() {
  this.users = new UsersService(this);
  this.projects = new ProjectsService(this);
  this.states = new StatesService(this);
  this.items = new ItemsService(this);
}

Client.prototype.invoke = function(options, callback) {
  var options = {
    uri: this.address + options.path,
    qs: options.params,
    auth: {
      user: this.accessToken,
      pass: '-'
    }
  };

  request(options, function(error, response, body) {
    if (error)
      return callback(error);

    if (response.statusCode >= 400)
      return callback(new Error(response.statusCode));

    if (response.statusCode < 200)
      return callback(null, null);

    var data = JSON.parse(body).data;

    return callback(null, data);
  });
}

module.exports = Client;
