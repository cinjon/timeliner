Router.configure({
  layoutTemplate: 'base',
});

Router.map(function() {
  this.route('admin', {
    path: '/admin',
    before: function() {
      // if (!Roles.userIsInRole(Meteor.userId(), ['admin'])) {
      //   Log('Redirecting');
      //   this.redirect('/');
      // }
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
        Meteor.subscribe('links_from_episode', show_route, number),
        Meteor.subscribe('editors', show_route, number)
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
      }
    }
  });

  this.route('home', {
    path: '/',
    waitOn: function() {
      console.log('hiting home');
      return [
        Meteor.subscribe('home_shows'),
        Meteor.subscribe('home_shows_episodes')
      ]
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
    }
  });

  this.route('viewer', {
    path: '/viewer/:show_route/:number',
    waitOn: function() {
      var show_route = this.params.show_route;
      var number = parseInt(this.params.number);
      var start_time = this.params.hash;
      return [
        Meteor.subscribe('episodes_from_show', show_route),
        Meteor.subscribe('show_from_route', show_route),
        Meteor.subscribe('clips_from_episode', show_route, number),
        Meteor.subscribe('links_from_episode', show_route, number)
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
