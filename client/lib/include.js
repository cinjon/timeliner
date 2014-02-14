client_global_has_role = function(roles) {
  return Roles.userIsInRole(Meteor.userId(), roles);
}

client_global_is_claimer = function(claimer_id) {
    return claimer_id == Meteor.userId();
}

client_global_unclaimed = function(claimer_id) {
    return claimer_id == null;
}
