var max_chars = 140;

Template.editor.rendered = function() {
    videojs("#player", {"controls":true, "preload":"auto", "autoplay":false}, function(){});
    $('.vjs-big-play-button').css("margin-top", "-1.33em"); //to fix the play button, may not actually be consistent
    Session.set('current_char_counter', count_text_chars($('#text')));
    Session.set('clip_in_progress', false);
}

Template.editor.destroyed = function() {
    videojs("#player").dispose();
}

Template.editor.helpers({
    start_timing: function() {
        return {'label':'Start', 'id':'start_time'};
    },
    end_timing: function() {
        return {'label':'End', 'id':'end_time'};
    },
    completed_clips: function() {
        return Clips.find({episode_id:this._id}, {sort:{start:-1}});
    }
});

Template.editor.events({
    'click #submit_episode': function(e, tmpl) {
        console.log(this.episode.links);
        if (this.episode.links.length > 0) {
            Meteor.call('mark_episode_edited', this.episode, function(err, data) {
                //show giant green checkmark in top right, wait 3 seconds, redirect
                console.log('giant green checkmark');
            });
        } else {
            //send message saying do your job.
            console.log('red mean message');
        }
    },
    'click #submit_clip': function(e, tmpl) {
        validate_submission(
            this.episode._id,
            function(data) { //success
                Meteor.call(
                    'create_clip', data, function(err, data) {
                        Session.set('clip_in_progress', false);
                        reset_time();
                        reset_text();
                    }
                );
            },
            function(message) { //fail
                //TODO: show where it failed as a message
                $('#messages').html(message);
                $('#messages').show();
            }
        );
    },
    'click #reset_time': function(e, tmpl) {
        Session.set('clip_in_progress', false);
        reset_time();
    },
    'click #reset_all': function(e, tmpl) {
        Session.set('clip_in_progress', false);
        reset_time();
        reset_text();
    },
});

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

Template.editor_links.events({
    //on hitting enter to new line, should auto shorten links
})

Template.editor_timing_input.events({
    'click span': function(e, tmpl) {
        var a = $(tmpl.find('a'));
        var type = a.html();
        if (Session.get('clip_in_progress') && type == 'End') {
            record_time('end_time', function() {
                Session.set('clip_in_progress', false);
            });
        } else if (!Session.get('clip_in_progress') && type == 'Start') {
            record_time('start_time', function() {
                Session.set('clip_in_progress', true);
            });
        }
    }
});

// Template.timer_button.events({
//     'click #timer_button': function(e, tmpl) {
//         if (Session.get('clip_in_progress')) { //stopping segment
//             $(e.target).html('Start Clip');
//             record_time('end_time', function() {
//                 Session.set('clip_in_progress', false);
//             });
//         } else {
//             $(e.target).html('End Clip');
//             record_time('start_time', function() {
//                 Session.set('clip_in_progress', true);
//             });
//         }
//     }
// })

Template.editor_notes.events({
    'keyup #text': function(e, tmpl) {
        Session.set('current_char_counter', count_text_chars($(e.target)));
    }
});

Template.editable_clip.helpers({
    format_time: function(time) {
        return format_time(time);
    },
    author: function() {
        return this.editor_id; //fix later to get that person's name
    },
    link_objs: function() {
        return Links.find({_id:{$in:this.links}});
    }
});

var count_text_chars = function(text) {
    if (typeof text == "undefined" || !text) {
        return 0;
    }
    return text.text().length;
};

var format_time = function(seconds) { //handlebars instead?
    //assumes seconds >= 0
    var hours   = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds - (hours * 3600)) / 60);
    var secs = seconds - (hours * 3600) - (minutes * 60);

    var ret = "";
    ret += _format_time_part(hours);
    ret += ":";
    ret += _format_time_part(minutes);
    ret += ":";
    ret += _format_time_part(secs);
    return ret;
}

var _format_time_part = function(time) {
    if (time < 10) {
        return "0" + time.toString();
    } else {
        return time.toString();
    }
}

var record_time = function(id, callback) {
    var seconds = Math.round(videojs("#player").currentTime() - 10); //10 is the delay before you realized there was a segment
    if (seconds < 0) {
        seconds = 0;
    }
    $('#' + id).val(format_time(seconds));
    if (callback) {
        callback();
    }
}

var has_time = function(time) {
    if (!time || time == '00:00:00' || !('/^(\d{2})\:(\d{2}):(\d{2})$/'.test(time))) {
        return false;
    }
    return true;
}

var time_to_seconds = function(time) {
    var parts = time.split(':');
    return parseInt(parts[0])*3600 + parseInt(parts[1])*60 + parseInt(parts[2]);
}

var time_in_range = function(time) {
    return time_to_seconds(time) < $('#player').duration();
}

var time_in_order = function(start, end) {
    return time_to_seconds(start) < time_to_seconds(end);
}

var get_links = function() {
    var text = $('#links').text();
    var links = text.split('\n');
    var ret = [];

    for (var i = 0; i < links.length; i++) {
        //should have link titles ...
        ret.push({url:links[i], title:'Title of this link: ' + i});
    }
}

var validate_submission = function(episode_id, success_callback, fail_callback) {
    var data = {};
    var count_chars = count_text_chars($('#text'));
    var start = $('#start_time').val()
    var end = $('#end_time').val()

    if (Session.get('clip_in_progress')) {
        fail_callback('Clip in Progress');
    } else if (!has_time(start)) {
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
    }

    var links = get_links();
    var timestamp = (new Date()).getTime();
    clip_data = {start:time_to_seconds(start), end:time_to_seconds(end), notes:$('#text').text(),
                 episode_id:episode_id, editor_id:Meteor.user()._id, created_at:timestamp,
                 links:links};
    data = {clip_data:clip_data, ts:timestamp, episode_id:episode_id};
    success_callback(data);
}

var reset_time = function() {
    $('#start_time').val('00:00:00');
    $('#end_time').val('00:00:00');
}

var reset_text = function() {
    $('#text').text('');
    Session.set('current_char_counter', 0);
    $('#links').text('');
}
