Template.test_your_might.created = function() {
  Session.set('trial', true);
}

Template.test_your_might.destroyed = function() {
  Session.set('trial', false);
  Session.set('trial_running', false);
}

Template.test_your_might.helpers({
  episode_and_show: function() {
    if (Session.get('trial_running')) {
      var episode = Trials.findOne({user_id:Meteor.userId(), show_route:ONLY_TRIAL_ROUTE});
    } else {
      var episode = this.episode;
    }

    if (episode) {
        return {
            episode: episode,
            show: Shows.findOne({show_route:episode.show_route})
        }
    } else {
        return {
            episode: undefined,
            show: undefined,
        }
    }
  },
  episode: function() {
    if (Session.get('trial_running')) {
      return Trials.findOne({user_id:Meteor.userId(), show_route:ONLY_TRIAL_ROUTE});
    } else {
      return this.episode;
    }
  },
});

should_trial_run = function() {
  return Trials.find({user_id:Meteor.userId(), show_route:ONLY_TRIAL_ROUTE,
                      started_time:{$ne:null}, completed_time:null}).count() > 0;
}

if (Meteor.isClient) {
  Meteor.subscribe('trial', Meteor.userId(), function() {
    Session.set('trial_running', should_trial_run());
  });

  Deps.autorun( function () {
    if (Session.equals('trial_running', true)) {
      Meteor.subscribe('clips_from_trial', Meteor.userId(), ONLY_TRIAL_ROUTE);
    }
  });
}



