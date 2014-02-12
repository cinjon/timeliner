var max_chars = 140;

Template.editor.rendered = function() {
    Session.set('current_char_counter', count_text_chars($('#text')));
    Session.set('isEditing', true);;
    Session.set('message', null);
}

Template.editor.destroyed = function() {
    Session.set('current_char_counter', null);
    Session.set('isEditing', false);
    Session.set('message', null);
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
        return this.editor_id; //fix later to get that person's name
    },
    link_objs: function() {
        return Links.find({_id:{$in:this.links}});
    }
});

Template.editor.helpers({
    start_timing: function() {
        return {'label':'Start', 'id':'start_time'};
    },
    end_timing: function() {
        return {'label':'End', 'id':'end_time'};
    },
    completed_clips: function() {
        return Clips.find({episode_id:this._id}, {sort:{start:-1}});
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
            episode:this.episode,
            show:this.show
        }
    }
});

Template.episode_title.helpers({
    editingPermission: function(e, tmpl) {
        return Session.get('isEditing') && Meteor.userId() && Roles.userIsInRole(Meteor.userId(), ['admin', 'editor']);
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
                    $('#checkmark').show();
                    setTimeout(function() { Router.go('/queue') }, 3000);
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
    'click #reset_time': function(e, tmpl) {
        reset_time();
    },
    'click #reset_all': function(e, tmpl) {
        reset_time();
        reset_text();
        reset_message();
    },
});

Template.editor_links.events({
    //on hitting enter to new line, should auto shorten links
});

Template.editor_notes.events({
    'keyup #text': function(e, tmpl) {
        Session.set('current_char_counter', count_text_chars($(e.target)));
    }
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
    return parseInt(parts[0])*3600 + parseInt(parts[1])*60 + parseInt(parts[2]);
}

var time_in_range = function(time) {
    return time_to_seconds(time) < videojs('#player').duration();
}

var time_in_order = function(start, end) {
    return time_to_seconds(start) < time_to_seconds(end);
}

var get_links = function() {
    var text = $('#links').text();
    var links = text.split("\n");
    var ret = [];

    for (var i = 0; i < links.length; i++) {
        //should have link titles ...
        ret.push({url:links[i], text:'Title of this link: ' + i});
    }
    return ret;
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
                start:time_to_seconds(start), end:time_to_seconds(end), notes:$('#text').text(),
                episode_id:episode_id, editor_id:Meteor.user()._id, created_at:timestamp,
                links:get_links()
            }, ts:timestamp, episode_id:episode_id
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
