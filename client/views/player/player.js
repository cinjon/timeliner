Template.editor_player.destroyed = function() {
    Meteor.Keybindings.removeAll();
    dispose_video();
};

Template.editor_player.rendered = function() {
  load_video(0);


  // testing this out as a fix for shortcut 'stacking' effect
  // theory: rerendered player was executing each shortcut multiple times
  Meteor.Keybindings.removeAll();

  // preventDefault() appears to fix a jquery bug that has been documented but
  // should have been fixed. Testing and it seems to work so I'll stick with it.
  Meteor.Keybindings.add({
    'ctrl+space': function() {
      if (videojs("#player").paused()) {
        videojs("#player").play();
      } else {
        videojs("#player").pause();
      }
      e.preventDefault();
    },
    'ctrl+,': function () {
     global_skip_player(event, "Back");
    },
    'ctrl+.': function () {
      global_skip_player(event, "Forward");
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
    },
    'ctrl+enter': function () {
      $('#submit_clip').click();
    }
  });
};

Template.view_player.destroyed = function() {
    dispose_video();
};

Template.view_player.rendered = function() {
    load_video(0);
};

var dispose_video = function() {
    videojs("#player").dispose();
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