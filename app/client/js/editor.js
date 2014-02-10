Template.editor.rendered = function() {
    videojs("#player", {"controls":true, "preload":"auto", "autoplay":false}, function(){});
    $('#timer_button').css("height", $('#player').height());
    Session.set('current_char_counter', count_text_chars($('#text')));
}

Template.editor.destroyed = function() {
  videojs("#player").dispose();
}

var max_chars = 300;
var count_text_chars = function(text) {
    if (typeof text == "undefined" || !text) {
        return 0;
    }
    return text.text().length;
};

Template.editor.helpers({
    start_timing: function() {
        return {'label':'Start', 'id':'start_time'};
    },
    end_timing: function() {
        return {'label':'End', 'id':'end_time'};
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

Template.editor_notes.events({
    'keyup #text': function(e, tmpl) {
        Session.set('current_char_counter', count_text_chars($(e.target)));
    }
});