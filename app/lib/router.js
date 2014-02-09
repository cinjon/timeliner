//nextmarket_id
//commonsense_id
//nextmarket_66_id
//commonsense_257_id

Router.configure({
    layoutTemplate:'base',
});

Router.map(function() {
    this.route('home', {
        path:'/',
    });
    this.route('testEditor', {
        path:'/testEditor',
    });
    this.route('queue', {
        path:'/queue',
        waitOn: function() {
            return [Meteor.subscribe('unedited_episodes'), Meteor.subscribe('shows_with_unedited_episodes')];
        },
        before: function() {
            var ret = [];
            Shows.find().forEach(function(show) {
                var episodes = Episodes.find({show_id:show._id, edited:false}).fetch();
                if (episodes.length > 0) {
                    ret.push({'show':show,
                              'episodes':episodes
                             });
                }
            });
            Session.set('queue_data', ret);
        }
    });
    this.route('editor', {
        path:'/editor/:show_route/:number',
        layoutTemplate:'base',
        waitOn: function() {
            var show_route = this.params.show_route;
            var episode = this.params.number;
            return [Meteor.subscribe('show_from_route', show_route), Meteor.subscribe('episode_from_show', show_route, episode)];
        },
        data: function() {
            var show = Shows.findOne({_id:this.params.show_route});
            var episode = Episodes.findOne({show_route:this.params.show_route,
                                            number:this.params.number});
            return {show:show, episode:episode};
        }
    });
    this.route('viewer', {
        path:'/view/',
        layoutTemplate:'base',
    });
});
