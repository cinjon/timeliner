var player = null;
var max_chars = 140;

Template.editor.rendered = function() {
    videojs("#player", {"controls":true, "preload":"auto", "autoplay":false}, function(){});
    videojs("player").ready(function() {
        player = this;
    });

    $('#timer_button').css("height", $('#player').height());
    $('.vjs-big-play-button').css("margin-top", "-1.33em");
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
        return Clips.find({episode_id:this._id});
    }
});

Template.editor.events({
    'click #submit_clip': function(e, tmpl) {
        console.log('submitting clip');
        validate_submission(
            function(data) { //success
                Meteor.call('create_clip', data);
            },
            function() { //fail

            }
        );
    }
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

Template.timer_button.events({
    'click #timer_button': function(e, tmpl) {
        if (Session.get('clip_in_progress')) { //stopping segment
            $(e.target).html('Start Clip');
            record_time('end_time', function() {
                Session.set('clip_in_progress', false);
            });
        } else {
            $(e.target).html('End Clip');
            record_time('start_time', function() {
                Session.set('clip_in_progress', true);
            });
        }
    }
})

Template.editor_notes.events({
    'keyup #text': function(e, tmpl) {
        Session.set('current_char_counter', count_text_chars($(e.target)));
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
    var seconds = Math.round(player.currentTime() - 10); //10 is the delay before you realized there was a segment
    if (seconds < 0) {
        seconds = 0;
    }
    $('#' + id).val(format_time(seconds));
    if (callback) {
        callback();
    }
}

var validate_submission = function(success_callback, fail_callback) {
    console.log('validating');
    }
