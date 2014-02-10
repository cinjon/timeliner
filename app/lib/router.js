Router.configure({
    layoutTemplate:'base',
});

Router.map(function() {
    this.route('home', {
        path:'/',
    });

    this.route('queue', {
        path:'/queue',
        waitOn: function() {
            return [
                Meteor.subscribe('unedited_episodes'),
                Meteor.subscribe('shows_with_unedited_episodes')
            ];
        },
        data: function() {
            return Episodes.find({edited:false});
        }
    });

    this.route('editor', {
        // let's discuss the path below vs /show/:id/episode/:number/edit tomorrow
        // also audio won't play without a reload if page is cached
        path:'/editor/:show_route/:number',
        waitOn: function() {
            return [
                Meteor.subscribe('episode_from_show', this.params.show_route, parseInt(this.params.number)),
                Meteor.subscribe('show_from_route', this.params.show_route)
            ];
        },
        data: function() {
            return {
                episode: Episodes.findOne({show_route:this.params.show_route,
                                        number:parseInt(this.params.number)}),
                show: Shows.findOne({show_route:this.params.show_route})
            }
        }
    });

    this.route('viewer', {
        path:'/view/',
    });
});
