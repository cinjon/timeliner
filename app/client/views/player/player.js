Template.editor_player.rendered = function() {
    videojs("#player", {"controls":true, "preload":"auto", "autoplay":false}, function(){});
    $('.vjs-big-play-button').css("margin-top", "-1.33em"); //to fix the play button, may not actually be consistent

    Meteor.Keybindings.add({
        'shift+space': function() {
            if ( videojs("#player").paused() ) {
                videojs("#player").play();
            } else {
                videojs("#player").pause();
            }
        },
        'shift+←': function() {
            time = videojs("#player").currentTime();
            videojs("#player").currentTime(time - 10);
        },
        'shift+alt+←': function() {
            time = videojs("#player").currentTime();
            videojs("#player").currentTime(time - 60);
        },
        'shift+→': function() {
            time = videojs("#player").currentTime();
            videojs("#player").currentTime(time + 10);
        },
         'shift+alt+→': function() {
            time = videojs("#player").currentTime();
            videojs("#player").currentTime(time + 60);
        },
        'shift+↑': function() {
            time = videojs("#player").currentTime();
            global_record_time("start_time");
        },
        'shift+↓': function() {
            time = videojs("#player").currentTime();
            global_record_time("end_time");
        }
    });
}

Template.view_player.rendered = function() {
    videojs("#player", {"controls":true, "preload":"auto", "autoplay":false}, function(){});
    $('.vjs-big-play-button').css("margin-top", "-1.33em"); //to fix the play button, may not actually be consistent
}

Template.editor_player.destroyed = function() {
    videojs("#player").dispose();
    Meteor.Keybindings.remove(['shift+space', 'shift+←', 'shift+alt+←',
        'shift+→', 'shift+alt+→', 'shift+↑', 'shift+↓' ]);
}

Template.view_player.destroyed = function() {
    videojs("#player").dispose();
}