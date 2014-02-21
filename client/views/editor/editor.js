var max_chars = 140;

//TODO: Change this before giving to editors.

Template.editor.created = function() {
  Session.set('message', null);
  Session.set('current_char_counter', count_text_chars($('#notes')));
  Session.set('is_completed', false);
  Session.set('current_clip_links', []);
  Session.set('editing_clip', false);
}

Template.editor.rendered = function() {
  var height = $('#player').height();
  $('#editor_start_back_parent').css("height", height);
  $('#editor_end_forward_parent').css("height", height);
  $('#add_link_parent').css("height", height);
  $('#skip_forward_button').closest('div').css("bottom", 0);
  $('#skip_back_button').closest('div').css("bottom", 0);
  $('#link_text').closest('div').css("bottom", 0);
}

Template.editor.destroyed = function() {
  Session.set('current_char_counter', null);
  Session.set('message', null);
}

Template.episode_title.rendered = function() {
    global_resize_font_to_fit('.resizeMe', $('#title_div').width());
}

// HELPERS

Template.character_cutoff.helpers({
  current_char_counter: function() {
    return Session.get('current_char_counter');
  },
  current_notes_color: function() {
    if (Session.get('current_char_counter') > max_chars) {
      return '#EB1E2C';
    } else {
      return '#000000';
    }
  },
  max_chars: function() {
    return max_chars;
  }
});

Template.editable_clip.helpers({
  format_time: function(time) {
    return global_format_time(time);
  },
  author: function() {
    var user = Meteor.users.findOne({_id:this.editor_id});
    if (user && user.username) {
      return user.username;
    } else if (user && user.emails && user.emails[0]) {
      return user.emails[0].address;
    }
  },
  link_objs: function() {
    return Links.find({_id:{$in:this.links}});
  },
  editing_this_clip: function() {
    return Session.get('editing_clip') == this._id
  },
  clip_id: function() {
    return this._id;
  },
});

Template.editor.helpers({
  completed_clips: function() {
    return Clips.find({
      episode_id: this._id
    }, {
      sort: {
        start: -1
      }
    });
  },
  displayMessageStyle: function() {
    if (Session.get('message') == null) {
      return 'none';
    }
    return 'block';
  },
  end_timing: function() {
    return {
      'label': 'End',
      'id': 'end_time'
    };
  },
  episode_and_show: function() {
    return {
      episode: this.episode,
      show: this.show
    }
  },
  skip_back: function() {
    return {
      'label': 'Back',
      'id': 'skip_back_button'
    }
  },
  skip_forward: function() {
    return {
      'label': 'Forward',
      'id': 'skip_forward_button'
    }
  },
  getMessage: function() {
    return Session.get('message');
  },
  is_claimed: function(e, tmpl) {
    if (this.episode) {
      var claimer_id = this.episode.claimer_id;
      return !client_global_unclaimed(claimer_id) && !client_global_is_claimer(claimer_id);
    }
  },
  is_claimer: function() {
    return client_global_has_role(['admin', 'editor']) && this.episode && client_global_is_claimer(this.episode.claimer_id);
  },
  is_unclaimed: function(e, tmpl) {
    return this.episode && client_global_unclaimed(this.episode.claimer_id);
  },
  is_completed: function() {
    return Session.get('is_completed');
  },
  is_trial: function() {
    return Session.get('trial');
  },
  link_text: function() {
    return {
      'id': 'link_text',
      'label': 'Link Title Here'
    }
  },
  link_url: function() {
    return {
      'id': 'link_url',
      'label': 'Link URL Here'
    }
  },
  reset_time: function() {
    return {
      'label': 'Reset Time',
      'id': 'reset_time'
    }
  },
  start_timing: function() {
    return {
      'label': 'Start',
      'id': 'start_time'
    };
  }
});

// EVENTS

Template.editable_clip.events({
  'click .editor_text_notes': function(e, tmpl) {
    Session.set('message', null);
    if (!Session.get('editing_clip')) {
      Session.set('editing_clip', this._id);
      var editor_text_notes = e.target;
      editor_text_notes.setAttribute("contenteditable", true);
      editor_text_notes.style.cursor = "auto";
      editor_text_notes.focus();
    }
  },
  'click .remove_link': function(e, tmpl) {
    var parent = $(e.target).parent();
    var clip_id = parent.attr('clip_id');
    Meteor.call('remove_link', this._id, clip_id);
  },
  'click #save_edits': function(e, tmpl) {
    var editor_text_notes = tmpl.find('.editor_text_notes');
    var text = editor_text_notes.innerText;
    if (text.length <= 140) {
      $('#cutoff_message').html('');
      Meteor.call(
        'save_edits', this._id, text,
        function() {
          reset_editor_text_notes(editor_text_notes);
        }
      );
    } else {
      $('#cutoff_message').html('The text is too long');
    }
  },
  'click #cancel_edits': function(e, tmpl) {
    Session.set('message', null);
    $(tmpl.find('.cutoff_message')).html('');
    reset_editor_text_notes(tmpl.find('.editor_text_notes'));
    tmpl.find('.editor_text_post').innerHTML = this.notes;
  }
});

Template.editor.events({
  'click #submit_episode': function(e, tmpl) {
    if (Session.get('message') !== null) {
      return;
    }
    if (Session.get('trial')) { //trial editor
      Meteor.call('end_trial', Meteor.userId());
    } else if (Clips.find({episode_id:this.episode._id}).count() > 0) {
      Meteor.call('mark_episode_edited', this.episode._id, function(err, data) {
        if (err) {
          Session.set('message', err);
        } else {
          Session.set('is_completed', true);
          setTimeout(function() {
            Router.go('/queue')
          }, 3000);
        }
      });
    } else {
      Session.set('message', 'Please add a clip before submitting');
    }
  },
  'click #claim_episode': function(e, tmpl) {
    Session.set('message', null);
    Meteor.call('claim_episode', this.episode._id, Meteor.userId());
  },
  'click #unclaim_episode': function(e, tmpl) {
    Session.set('message', null);
    Meteor.call('unclaim_episode', this.episode._id, Meteor.userId());
  },
  'click #start_trial': function(e, tmpl) {
    Session.set('message', null);
    Meteor.call('start_trial', Meteor.userId());
  },
  'click #submit_clip': function(e, tmpl) {
    Session.set('message', null);
    validate_submission(
      this.episode._id,
      function(data) { //success
        data['clip_data']['trial'] = Session.get('trial');
        Meteor.call(
          'create_clip', data,
          function(err, data) {
            reset_time();
            reset_text();
          }
        );
      },
      function(message) { //fail
        Session.set('message', message);
      }
    );
  },
  'click #add_link': function(e, tmpl) {
    Session.set('message', null);
    var url = $('#link_url').val();
    var text = $('#link_text').val();
    if (!url || url == '') {
      Session.set('message', 'Please enter a url first');
    } else if (!text || text == '') {
      Session.set('message', 'Please enter a title first');
    } else {
      var clip_links = Session.get('current_clip_links');
      clip_links.push({url:url, text:text});
      Session.set('current_clip_links', clip_links);
    }
  }
});

Template.editor_links.helpers({
  current_clip_links: function() {
    return Session.get('current_clip_links');
  }
});

Template.clip_link.events({
  'click .remove_link': function(e, tmpl) {
    var clip_links = Session.get('current_clip_links');
    var position = null;
    for (var i = 0; i < clip_links.length; i++) {
      if (clip_links[i].url == this.url && clip_links[i].text == this.text) {
        clip_links.splice(position, 1);
        Session.set('current_clip_links', clip_links);
        break;
      }
    }
  }
});

Template.editor_notes.events({
  'keyup #notes': function(e, tmpl) {
    Session.set('current_char_counter', count_text_chars($(e.target)));
  }
});

Template.editor_reset_button.events({
  'click #reset_time': function(e, tmpl) {
    reset_time();
  },
});

Template.editor_skip_button.events({
  'click span': function(e, tmpl) {
    return global_skip_player(this.label);
  },
  'click button': function(e, tmpl) {
    return global_skip_player(this.label);
  }
});

Template.editor_skip_button.helpers({
  direction: function() {
    if (this.label == "Back") {
      return "left";
    } else if (this.label == "Forward") {
      return "right";
    } else {
      return "up";
    }
  }
});

Template.editor_timing_input.events({
  'click span': function(e, tmpl) {
    Session.set('message', null);
    var a = $(tmpl.find('a'));
    var type = a.html();
    if (type == 'End') {
      global_record_time('end_time');
    } else if (type == 'Start') {
      global_record_time('start_time');
    }
  }
});


// FUNCTIONS

var count_text_chars = function(text) {
  if (typeof text == "undefined" || !text) {
    return 0;
  }
  return text.text().length;
};

var has_time = function(time) {
  if (!time || time == '00:00:00' || !(/^(\d{2})\:(\d{2}):(\d{2})$/.test(time))) {
    return false;
  }
  return true;
}

var time_to_seconds = function(time) {
  var parts = time.split(':');
  return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
}

var time_in_range = function(time) {
  return time_to_seconds(time) < videojs('#player').duration();
}

var time_in_order = function(start, end) {
  return time_to_seconds(start) < time_to_seconds(end);
}

var validate_submission = function(episode_id, success_callback, fail_callback) {
  var data = {};
  var count_chars = count_text_chars($('#notes'));
  var start = $('#start_time').val()
  var end = $('#end_time').val()

  if (!has_time(start)) {
    fail_callback('Please set the start time.')
  } else if (!has_time(end)) {
    fail_callback('Please set the end time.');
  } else if (!time_in_range(start)) {
    fail_callback('The Start Time is not in the right range');
  } else if (!time_in_range(end)) {
    fail_callback('The End Time is not in the right range');
  } else if (!time_in_order(start, end)) {
    fail_callback('The start time should be less than the end time');
  } else if (count_chars > 140) {
    fail_callback('The notes are too big');
  } else if (count_chars == 0) {
    fail_callback('Please write a note');
  } else {
    var timestamp = (new Date()).getTime();
    success_callback({
      clip_data: {
        start: time_to_seconds(start),
        end: time_to_seconds(end),
        notes: $('#notes').text(),
        episode_id: episode_id,
        editor_id: Meteor.userId(),
        created_at: timestamp,
        links: Session.get('current_clip_links')
      },
      ts: timestamp,
      episode_id: episode_id
    });
  }
}

var reset_time = function() {
  Session.set('message', null);
  $('#start_time').val('00:00:00');
  $('#end_time').val('00:00:00');
}

var reset_text = function() {
  Session.set('current_char_counter', 0);
  Session.set('current_clip_links', []);
  $('#notes').text('');
  $('#link_text').val('');
  $('#link_url').val('');
}

var reset_editor_text_notes = function(element) {
  Session.set('editing_clip', false);
  element.setAttribute('contentEditable', 'false');
  element.style.cursor = 'pointer';
}
