Template.test_your_might.created = function() {
  Session.set('trial', true);
}

Template.test_your_might.destroyed = function() {
  Session.set('trial', false);
  Session.set('trial_running', null);
}

Template.test_your_might.helpers({
  episode_and_show: function() {
    if (Session.get('trial_running')) {
      var episode = Trials.findOne({user_id:Meteor.userId()});
    } else {
      var episode = this.episode;
    }
    return {
      episode: episode,
      show: Shows.findOne({show_route:episode.show_route})
    }
  },
  episode: function() {
    if (Session.get('trial_running')) {
      return Trials.findOne({user_id:Meteor.userId()});
    } else {
      return this.episode;
    }
  },
});

Deps.autorun(function() {
  Meteor.subscribe('trial', Meteor.userId(), function() {
    Session.set('trial_running',
                Trials.find({user_id:Meteor.userId(),
                             started_time:{$ne:null},
                             completed_time:null}).count() > 0);
  });
  Meteor.subscribe('clips_from_trial', Meteor.userId());
});
