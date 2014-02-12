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
  mark_episode_edited: function(episode) {
    var timestamp = (new Date()).getTime();
    Episodes.update({
      _id: episode._id
    }, {
      $set: {
        updated_at: timestamp,
        edited: true
      }
    });
  }
});
