// HELPERS

Template.queue.helpers({
    shows: function() {
        var show_ids = [];
        Episodes.find({edited:false}).forEach(function(episode) {
            show_ids.push(episode.show_id);
        });
        return Shows.find({_id:{$in:show_ids}});
    },
    episodes: function() {
        return Episodes.find({show_id:this._id});
    }
});