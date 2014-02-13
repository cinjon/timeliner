var max_chars = 140;

Session.set('current_clip_links', [{url:'www.google.com', text:'Google'}]);

Template.editor.rendered = function() {
  Session.set('current_char_counter', count_text_chars($('#text')));
  Session.set('isEditing', true);;
  Session.set('message', null);
  Session.set('isCompleted', false);

  var height = $('#player').height();
  $('#editor_timing_parent').css("height", height);
  $('#editor_link_parent').css("height", height);
  $('#add_link_parent').css("height", height);
  $('#end_time').closest('div').css("bottom", 0);
  $('#link_text').closest('div').css("bottom", 0);

  var link_url = $('#link_url');
  var submit_episode = $('#submit_episode');
  var title_div = $('#title_div');
  var offset_left = link_url.offset().left + link_url.outerWidth() - submit_episode.outerWidth();
  submit_episode.offset({left:offset_left});

//   var new_width = offset_left - submit_episode.offset().left + title_div.width();
//   title_div.outerWidth(new_width);
}

Template.editor.destroyed = function() {
  Session.set('current_char_counter', null);
  Session.set('isEditing', false);
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
        //TODO: implement username for editors
        var user = Meteor.users.findOne({_id:this.editor_id});
        if (user && user.emails && user.emails[0]) {
            return user.emails[0].address;
        }
    },
    link_objs: function() {
        return Links.find({_id:{$in:this.links}});
    }
});

Template.editor.helpers({
  start_timing: function() {
    return {
      'label': 'Start',
      'id': 'start_time'
    };
  },
  end_timing: function() {
    return {
      'label': 'End',
      'id': 'end_time'
    };
  },
  reset_time: function() {
    return {
      'label': 'Reset Time',
      'id': 'reset_time'
    }
  },
  reset_all: function() {
    return {
      'label': 'Reset All',
      'id': 'reset_all'
    }
  },
  completed_clips: function() {
    return Clips.find({
      episode_id: this._id
    }, {
      sort: {
        start: -1
      }
    });
  },
  getMessage: function() {
    return Session.get('message');
  },
  displayMessageStyle: function() {
    if (Session.get('message') == null) {
      return 'none';
    }
    return 'inline-block';
  },
  episode_and_show: function() {
    return {
      episode: this.episode,
      show: this.show
    }
  },
  link_url: function() {
    return {
      'id': 'link_url',
      'label': 'Link URL Here'
    }
  },
  link_text: function() {
    return {
      'id': 'link_text',
      'label': 'Link Title Here'
    }
  },
});

Template.episode_title.helpers({
  editingPermission: function(e, tmpl) {
    return Session.get('isEditing') && global_has_role(['admin', 'editor'])
  }
});

// EVENTS

Template.editor.events({
  'click #submit_episode': function(e, tmpl) {
    if (this.episode.links.length > 0) {
      Meteor.call('mark_episode_edited', this.episode, function(err, data) {
        //show giant green checkmark in top right, wait 3 seconds, redirect
        if (err) {
          Session.set('message', err);
        } else {
          Session.set('isCompleted', true);
          setTimeout(function() {
            Router.go('/queue')
          }, 3000);
        }
      });
    } else {
      //send message saying do your job.
      Session.set('message', 'Please add a clip before submitting');
    }
  },
  'click #submit_clip': function(e, tmpl) {
    validate_submission(
      this.episode._id,
      function(data) { //success
        Meteor.call(
          'create_clip', data, function(err, data) {
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

Template.editor_notes.events({
  'keyup #text': function(e, tmpl) {
    Session.set('current_char_counter', count_text_chars($(e.target)));
  }
});

Template.editor_reset_button.events({
  'click #reset_time': function(e, tmpl) {
    reset_time();
  },
  'click #reset_all': function(e, tmpl) {
    reset_time();
    reset_text();
    reset_message();
  },
});

Template.editor_timing_input.events({
  'click span': function(e, tmpl) {
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
  console.log(time);
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
  var count_chars = count_text_chars($('#text'));
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
        notes: $('#text').text(),
        episode_id: episode_id,
        editor_id: Meteor.user()._id,
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
  $('#text').text('');
  Session.set('current_char_counter', 0);
  $('#links').text('');
}