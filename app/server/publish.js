Meteor.publish('show_from_route', function(show_route) {
    return Shows.find({show_route:show_route});
});

Meteor.publish('episode_from_show', function(show_route, number) {
    return Episodes.find({show_route:show_route, number:number});
});

Meteor.publish('unedited_episodes', function() {
    return Episodes.find({edited:false});
});

Meteor.publish('shows_with_unedited_episodes', function() {
    var show_ids = [];
    Episodes.find({edited:false}).forEach(function(episode) {
        show_ids.push(episode.show_id);
    });
    return Shows.find({_id:{$in:show_ids}});
});


