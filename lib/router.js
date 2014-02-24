var SHOW_VIEWER = false;

var ir_before_hooks = {
  is_admin: function() {
    if (!Roles.userIsInRole(Meteor.userId(), ['admin'])) {
      this.redirect('home');
    }
  },
  is_editor: function() {
    if (!Meteor.userId()) {
      this.redirect('home');
    } else {
      if (Meteor.subscribe('user_roles', Meteor.userId()).ready() && !Roles.userIsInRole(Meteor.userId(), 'editor')) {
        this.redirect('home');
      }
    }
  },
  show_viewer: function() {
    if (!SHOW_VIEWER) {
      this.redirect('home');
    }
  }
}

Router.configure({
  layoutTemplate: 'base',
});

Router.before(ir_before_hooks.is_admin, {only:['admin']});
Router.before(ir_before_hooks.show_viewer, {only:['viewer']});
if (Meteor.isClient) {
  Router.before(ir_before_hooks.is_editor, {only:['editor', 'queue', 'staging']})
}

Router.map(function() {

  this.route('admin', {
    path: '/admin',
  });

  this.route('editor', {
    path: '/editor/:show_route/:number',
    waitOn: function() {
      var show_route = this.params.show_route;
      var number = parseInt(this.params.number);
      return [
        Meteor.subscribe('episode_from_show', show_route, number),
        Meteor.subscribe('show_from_route', show_route),
        Meteor.subscribe('clips_from_episode', show_route, number),
        Meteor.subscribe('editors')
      ];
    },
    data: function() {
      var show_route = this.params.show_route;
      var number = parseInt(this.params.number);
      return {
        episode: Episodes.findOne({
          show_route: show_route,
          number: number
        }),
        show: Shows.findOne({
          show_route: show_route
        })
      };
    },
  });

  this.route('home', {
    path: '/',
    waitOn: function() {
      return [
        Meteor.subscribe('home_shows'),
        Meteor.subscribe('home_shows_episodes')
      ];
    },
  });

  this.route('queue', {
    path: '/queue',
    waitOn: function() {
      return [
        Meteor.subscribe('unedited_episodes'),
        Meteor.subscribe('shows_with_unedited_episodes')
      ];
    },
    data: function() {
      return Episodes.find({
        edited: false
      });
    },
  });

  this.route('staging', {
    path:'/staging',
    waitOn: function() {
      return [
        Meteor.subscribe('unapproved_episodes'),
        Meteor.subscribe('editors')
      ]
    },
    data: function () {
      var episodes = Episodes.find({approved:false, edited:true});
      var show_names = episodes.map(function(episode) {
        return {show_id:episode.show_id, name:Shows.findOne({_id:episode.show_id}).name};
      });
      return {
        show_names: show_names
      }
    }
  });

  this.route('test_your_might', {
    path:'/Test-Your-Might',
    waitOn: function() {
      return [
        Meteor.subscribe('trial', 'TEMPLATE_TRIAL'),
        Meteor.subscribe('trial_shows')
      ]
    },
    data: function() {
      var trial = Trials.findOne({user_id:"TEMPLATE_TRIAL"});
      return {
        episode: trial
      }
    }
  });

  this.route('viewer', {
    path: '/viewer/:show_route/:number',
    yieldTemplate: {
      'view_secondary': {to: 'secondary'}
    },
    waitOn: function() {
      var show_route = this.params.show_route;
      var number = parseInt(this.params.number);
      var start_time = this.params.hash;
      return [
        Meteor.subscribe('episodes_from_show', show_route),
        Meteor.subscribe('show_from_route', show_route),
        Meteor.subscribe('clips_from_episode', show_route, number),
        Meteor.subscribe('editors', show_route, number)
      ]
    },
    data: function() {
      var show_route = this.params.show_route;
      var number = parseInt(this.params.number);
      var start_time = global_convert_time_to_seconds(this.params.hash); //e.g. 1h33m12s
      return {
        episode: Episodes.findOne({
          show_route: show_route,
          number: number
        }),
        show: Shows.findOne({
          show_route: show_route
        }),
        start_time: start_time
      }
    }
  });
});

