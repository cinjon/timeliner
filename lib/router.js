Router.configure({
  layoutTemplate: 'base',
});

Router.map(function() {

  this.route('admin', {
    path: '/admin',
    // This appears to be a bug, not executing before callback
    // I don't think people can login but it exposes the page
    // FIXME: consider removing this pre-production
    before: function() {
      if (!Roles.userIsInRole(Meteor.userId(), ['admin'])) {
        this.redirect('home');
      }
    }
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
    before: function() {
      if ( !Roles.userIsInRole(Meteor.userId(), 'editor') ) {
        this.redirect('home');
      }
    }
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
    before: function() {
      if ( !Roles.userIsInRole(Meteor.userId(), ['editor']) ) {
        this.redirect('home');
      }
    }
  });

  this.route('staging', {
    path:'/staging',
    before: function() {
      if (!Roles.userIsInRole(Meteor.userId(), ['editor'])) {
        this.redirect('home');
      }
    },
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

//   this.route('viewer', {
//     path: '/viewer/:show_route/:number',
//     yieldTemplate: {
//       'view_secondary': {to: 'secondary'}
//     },
//     waitOn: function() {
//       var show_route = this.params.show_route;
//       var number = parseInt(this.params.number);
//       var start_time = this.params.hash;
//       return [
//         Meteor.subscribe('episodes_from_show', show_route),
//         Meteor.subscribe('show_from_route', show_route),
//         Meteor.subscribe('clips_from_episode', show_route, number),
//         Meteor.subscribe('editors', show_route, number)
//       ]
//     },
//     data: function() {
//       var show_route = this.params.show_route;
//       var number = parseInt(this.params.number);
//       var start_time = global_convert_time_to_seconds(this.params.hash); //e.g. 1h33m12s
//       return {
//         episode: Episodes.findOne({
//           show_route: show_route,
//           number: number
//         }),
//         show: Shows.findOne({
//           show_route: show_route
//         }),
//         start_time: start_time
//       }
//     }
//   });
});
