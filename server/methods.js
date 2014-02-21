var collision_count = function(data, episode_id) {
  var start = data['clip_data']['start'];
  var end = data['clip_data']['end'];
  return Clips.find({
    episode_id: episode_id,
    $where: "this.end >= " + start + " && " + end + " >= this.start"
  }).count();
};

Meteor.methods({
  claim_episode: function(episode_id, user_id) {
    Episodes.update({
      _id: episode_id
    }, {
      $set: {
        claimer_id: user_id
      }
    });
  },
  create_clip: function(data) {
    //TODO: set next_clip, previous_clip
    var episode_id = data['episode_id'];
    var count = collision_count(data, episode_id);
    while (!(typeof count === 'number')) {
      //TODO: fix this hack
    }

    if (count == 0) {
      var clip_id = Clips.insert(data['clip_data']);
    } else {
      console.log('hey yo, bad clip push');
    }
  },
  end_trial: function(user_id) {
    var timestamp = (new Date()).getTime();
    Trials.update({user_id:user_id}, {$set:{completed_time:timestamp, edited:true}});
  },
  mark_episode_edited: function(episode_id) {
    var timestamp = (new Date()).getTime();
    Episodes.update({
      _id: episode_id
    }, {
      $set: {
        updated_at: timestamp,
        edited: true,
        claimed_id: null
      }
    });
  },
  remove_link: function(link_id, clip_id) {
    Clips.update({_id:clip_id}, {$pull:{'links':link_id}});
    Clips.find({_id:clip_id}).forEach(function(clip) {
      Episodes.update(
        {_id:clip.episode_id},
        {$pull:{'links':link_id}}
      );
    });
  },
  save_edits: function(clip_id, notes) {
    Clips.update({
      _id: clip_id,
    }, {
      $set: {
        notes: notes
      }
    });
  },
  start_trial: function(user_id) {
    var timestamp = (new Date()).getTime();
    Trials.update({user_id:user_id}, {$set:{started_time:timestamp}});
  },
  unclaim_episode: function(episode_id, user_id) {
    Episodes.update({
      _id: episode_id, claimer_id: user_id
    }, {
      $set: {
        claimer_id: null
      }
    });
  },
});
