Meteor.publish('show_from_route', function(show_route) {
  return Shows.find({
    show_route: show_route
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

Meteor.publish('unedited_episodes', function() {
  return Episodes.find({
    edited: false
  });
});

Meteor.publish('editors', function(show_route, number) {
  //TODO: after making user creation hooks, limit this to username for editors
  return Meteor.users.find({}, function(user) {
    Roles.userIsInRole(user._id, ['editor', 'admin'])
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

Meteor.publish('unapproved_episodes', function() {
  return Episodes.find({approved:false, edited:true});
});

Meteor.publish('clips_from_episode', function(show_route, number) {
  var episode = Episodes.findOne({
    show_route: show_route,
    number: number
  });
  return Clips.find({
    episode_id: episode._id
  });
});

Meteor.publish('links_from_episode', function(show_route, number) {
  var episode = Episodes.findOne({
    show_route: show_route,
    number: number
  });
  return Links.find({}, {
    _id: {
      $in: episode.links
    }
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

var home_shows = function() {
  return Shows.find(); //TODO: change to incorporate some selection process, maybe recent
};
