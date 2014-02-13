global_has_role = function(roles) {
  return Roles.userIsInRole(Meteor.userId(), roles);
}