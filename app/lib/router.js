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
        before: function() {
            var number = parseInt(this.params.number);
            var show_route = this.params.show_route;
            this.subscribe('show_from_route', show_route).wait();
            this.subscribe('episode_from_show', show_route, number).wait();

            Session.set('show', Shows.findOne({show_route:show_route}));
            Session.set('episode', Episodes.findOne({show_route:show_route,
                                                     number:number}));
        },
    });
    this.route('viewer', {
        path:'/view/',
    });
});
