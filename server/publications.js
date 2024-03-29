Meteor.publish('clips_from_episode', function(show_route, number) {
  var episode = Episodes.findOne({
    show_route: show_route,
    number: number
  });
  return Clips.find({
    episode_id: episode._id
  });
});

Meteor.publish('clips_from_trial', function(user_id, show_route) {
  var trial = Trials.findOne({user_id:user_id, show_route:show_route});
  if (!trial) {
    trial = Trials.findOne({user_id:"TEMPLATE_TRIAL", show_route:show_route});
  }
  return Clips.find({episode_id:trial._id});
});

Meteor.publish('editors', function(show_route, number) {
  //TODO: after making user creation hooks, limit this to username for editors
  return Meteor.users.find({}, function(user) {
    Roles.userIsInRole(user._id, ['editor', 'admin']);
  });
});

Meteor.publish('episode_from_show', function(show_route, number) {
  return Episodes.find({
    show_route: show_route,
    number: number
  });
});

Meteor.publish('episodes_from_show', function(show_route) {
  return Episodes.find({
    show_route: show_route
  });
});

Meteor.publish('home_shows', function() {
  return home_shows();
});

Meteor.publish('home_shows_episodes', function() {
  var show_ids = [];
  home_shows().forEach(function(show) {
    show_ids.push(show._id);
  });
  return Episodes.find({
    show_id: {
      $in: show_ids
    }
  });
});

Meteor.publish('show_from_route', function(show_route) {
  return Shows.find({
    show_route: show_route
  });
});

Meteor.publish('shows_with_unedited_episodes', function() {
  var show_ids = [];
  Episodes.find({
    edited: false
  }).forEach(function(episode) {
    show_ids.push(episode.show_id);
  });
  return Shows.find({
    _id: {
      $in: show_ids
    }
  });
});

Meteor.publish('trial', function(user_id) {
  return Trials.find({user_id:user_id});
});

Meteor.publish('trial_shows', function() {
  return Shows.find({
    show_route:{
      $in:Trials.find({user_id:'TEMPLATE_TRIAL'}).map(function(trial) {
        return trial.show_route;
      })
    }
  });
});


Meteor.publish('unapproved_episodes', function() {
  return Episodes.find({approved:false, edited:true});
});

Meteor.publish('unedited_episodes', function() {
  return Episodes.find({
    edited: false
  });
});

Meteor.publish("user_roles", function(user_id) {
  return Meteor.users.find({_id:user_id}, {fields:{roles:true}});
});

var home_shows = function() {
  return Shows.find(); //TODO: change to incorporate some selection process, maybe recent
};
