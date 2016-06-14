var express = require('express');
var NautilusClient = require('../sdk/nautilus');
var _ = require('underscore');

var router = express.Router();

router.get('/', function(request, response, next) {
  var client = new NautilusClient();
  client.address = 'http://localhost:3000';
  client.accessToken = request.user.id;

  client.users.getAll(null, function(error, users) {
    if (error)
      return next(error);

    client.projects.getAll(null, function(error, projects) {
      if (error)
        return next(error);

      client.states.getAll(null, function(error, states) {
        if (error)
          return next(error);

        client.items.getAll({type: 'milestone'}, function(error, milestones) {
          if (error)
            return next(error);

          client.items.getAll({type: 'issue'}, function(error, issues) {
            if (error)
              return next(error);

            issues.forEach(function(issue) {
              issue.milestone = _.find(milestones, function(milestone) {
                return _.some(milestone.subItems, function(subItem) {
                  return subItem.id === issue.id;
                });
              });

              issue.assignedUser = issue.assignedUsers[0];
              delete issue.assignedUsers;
            });

            var data = {
              users: users,
              projects: projects,
              states: states,
              milestones: milestones,
              issues: issues,
              session: request.user
            };

            response.render('index', data);
          });
        });
      });
    });
  });
});

module.exports = router;