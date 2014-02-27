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
    Trials.update({user_id:user_id, show_route:ONLY_TRIAL_ROUTE}, {$set:{completed_time:timestamp, edited:true}});
  },
  mark_episode_edited: function(episode_id) {
    var timestamp = (new Date()).getTime();
    Episodes.update({
      _id: episode_id
    }, {
      $set: {
        updated_at: timestamp,
        edited: true,
        claimer_id: null
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
  send_email: function(mail_fields) {
    console.log("about to send email...");
    check([mail_fields.to, mail_fields.from, mail_fields.subject, mail_fields.text, mail_fields.html], [String]);

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    Meteor.Mailgun.send({
      to: mail_fields.to,
      from: mail_fields.from,
      subject: mail_fields.subject,
      text: mail_fields.text,
      html: mail_fields.html
    });
    console.log("email sent to " + mail_fields.to + " from " + mail_fields.from);
  },
  start_trial: function(user_id) {
    var timestamp = (new Date()).getTime();
    var template = Trials.findOne({user_id:"TEMPLATE_TRIAL", show_route:ONLY_TRIAL_ROUTE});
    Trials.insert({
      name: template.name,
      show_id: template.show_id,
      show_route: template.show_route,
      number: template.number,
      edited: false,
      seconds: template.seconds,
      s3: template.s3,
      created_at: timestamp,
      links: [],
      user_id: user_id,
      started_time: timestamp,
      completed_time: null
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
});
