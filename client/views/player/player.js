Template.editor_player.rendered = function() {
    load_video(0);

  Meteor.Keybindings.add({
    'shift+space': function() {
      if (videojs("#player").paused()) {
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
    load_video(998);
}

Template.editor_player.destroyed = function() {
    dispose_video();
    Meteor.Keybindings.remove(['shift+space', 'shift+←', 'shift+alt+←',
        'shift+→', 'shift+alt+→', 'shift+↑', 'shift+↓' ]);
}

Template.view_player.destroyed = function() {
    dispose_video();
}

var load_video = function(seconds) {
    videojs(
        "#player", {"controls":true, "preload":"auto", "autoplay":false},
        function() {
            $('.vjs-big-play-button').css("margin-top", "-1.33em"); //to fix the play button, may not actually be consistent
            $('.vjs-fullscreen-control').css("visibility", "hidden");
            this.currentTime(seconds);
        }
    );
}

var dispose_video = function() {
    videojs("#player").dispose();
}