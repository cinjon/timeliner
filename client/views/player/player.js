Template.editor_player.rendered = function() {
  load_video(0);


  // testing this out as a fix for shortcut 'stacking' effect
  // theory: rerendered player was executing each shortcut multiple times
  Meteor.Keybindings.removeAll();

  Meteor.Keybindings.add({
    'ctrl+space': function() {
      if (videojs("#player").paused()) {
        videojs("#player").play();
      } else {
        videojs("#player").pause();
      }
    },
    'ctrl+,': function () {
      time = videojs("#player").currentTime();
      videojs("#player").currentTime(time - 5);
    },
    'ctrl+.': function () {
      time = videojs("#player").currentTime();
      videojs("#player").currentTime(time + 5);
    },
    'ctrl+1': function () {
      time = videojs("#player").currentTime();
      global_record_time("start_time");
    },
    'ctrl+2': function () {
      time = videojs("#player").currentTime();
      global_record_time("end_time");
    },
    'ctrl+3': function () {
      $('#notes').focus();
    },
    'ctrl+4': function () {
      $('#link_url').focus();
    },
    'ctrl+5': function () {
      $('#link_text').focus();
    },
    'ctrl+6': function () {
      $('#add_link').click();
    }
  });
};

Template.view_player.rendered = function() {
    load_video(998);
};

Template.editor_player.destroyed = function() {
    dispose_video();
    Meteor.Keybindings.removeAll();
};

Template.view_player.destroyed = function() {
    dispose_video();
};

var load_video = function(seconds) {
    videojs(
        "#player", {"controls":true, "preload":"auto", "autoplay":false},
        function() {
            $('.vjs-big-play-button').css("margin-top", "-1.33em"); //to fix the play button, may not actually be consistent
            $('.vjs-fullscreen-control').css("visibility", "hidden");
            this.currentTime(seconds);
        }
    );
};

var dispose_video = function() {
    videojs("#player").dispose();
};