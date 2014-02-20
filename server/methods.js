Meteor.methods({
  create_clip: function(data) {
    //TODO: set next_clip, previous_clip
    var start = data['clip_data']['start'];
    var end = data['clip_data']['end'];
    var episode_id = data['episode_id'];
    var count = Clips.find({
      episode_id: episode_id,
      $where: "this.end >= " + start + " && " + end + " >= this.start"
    }).count(); //clip_collision
    while (!(typeof count === 'number')) {
      //TODO: fix this hack
    }

    if (count == 0) {
      var ts = data['ts'];
      var link_ids = [];
      var links = data['clip_data']['links'];
      for (var i = 0; i < links.length; i++) {
        var link = links[i];
        if (!link.text) {
          link.text = 'placeholder text';
        }

        link_obj = Links.findOne({
          url: link.url
        });
        if (!link_obj) {
          link_id = Links.insert({
            url: link.url,
            text: link.text,
            created_at: ts
          });
        } else {
          link_id = link_obj._id;
        }
        link_ids.push(link_id);
      }

      data['clip_data']['links'] = link_ids;
      var clip_id = Clips.insert(data['clip_data']);
      Episodes.update({
        _id: episode_id
      }, {
        $pushAll: {
          links: link_ids
        }
      });
    } else {
      console.log('hey yo, bad clip push');
    }
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
  claim_episode: function(episode_id, user_id) {
    Episodes.update({
      _id: episode_id
    }, {
      $set: {
        claimer_id: user_id
      }
    });
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
  save_edits: function(clip_id, notes) {
    Clips.update({
      _id: clip_id,
    }, {
      $set: {
        notes: notes
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
  }
});
