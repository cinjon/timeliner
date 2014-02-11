Meteor.methods({
    create_clip: function(data, callback) {
        //TODO: set next_clip, previous_clip
        var ts  = data['ts'];
        var link_ids = [];
        for (var i = 0; i < data['links'].length; i++) {
            var link = links[i];
            var link_id = Links.insert({url:link.url, text:link.text, created_at:ts});
            link_ids.push(link_id);
        }

        data['clip_data']['links'] = link_ids;
        var clip_id = Clips.insert(data['clip_data']);

        Episodes.update({_id:data['episode_id']}, {$push:{$each:links}});
    },
    mark_episode_edited: function(episode) {
        var timestamp = (new Date()).getTime();
        Episodes.update({_id:episode._id}, {$set:{updated_at:timestamp, edited:true}});
    }
});

