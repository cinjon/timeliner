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
        data: function() {
            return Episodes.find({edited:false});
        }
    });
    this.route('editor', {
        path:'/editor/:show_route/:number',
        waitOn: function() {
            var number = parseInt(this.params.number);
            var show_route = this.params.show_route;
            return [this.subscribe('episode_from_show', show_route, number).wait(),
                    this.subscribe('show_from_route', show_route).wait()]
        },
        data: function() {
            return {
                episode:Episodes.findOne({show_route:this.params.show_route,
                                          number:parseInt(this.params.number)}),
                show:Shows.findOne({show_route:this.params.show_route})
            }
        }
    });
    this.route('viewer', {
        path:'/view/',
    });
});
