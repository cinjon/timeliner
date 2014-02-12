Template.viewer.rendered = function() {
//     if (has_episodes(this.episode._id, this.episode.show_route)) { //not working
//         $('#togglesidebar').click();
//     }
}

Template.episode_clip.helpers({
    format_time: function(time) {
        return global_format_time(time);
    },
    author: function() {
        var user = Meteor.users.findOne({_id:this.editor_id});
        if (user && user.emails && user.emails[0]) {
            return user.emails[0].address;
        }
    }
});

Template.secondary_viewer.helpers({
    has_episodes: function() {
        return false;
//         has_episodes(this.episode._id, this.episode.show_route);
    },
    more_episodes: function() { //erm, don't like doing this twice... cacccche pls.
        //apply a sort to this by reverse date of episode release
        return Episodes.find({episode_id:{$not:this.episode._id}, show_route:this.episode.show_route});
    },
});

Template.viewer.helpers({
    completed_clips: function() {
        return Clips.find({episode_id:this._id}, {sort:{start:-1}});
    },
    episode_and_time: function() {
        console.log('in e&t');
        console.log(this.start_time);
        return {
            episode:this.episode,
            start_time:this.start_time
        }
    }
});

var has_episodes = function(episode_id, show_route) {
    return Episodes.find({_id:{$not:episode_id}, show_route:show_route}).count() > 0;
}