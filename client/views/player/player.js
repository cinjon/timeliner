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
      time = videojs("#player").currentTime();
      videojs("#player").currentTime(time - 5);
      e.preventDefault();
    },
    'ctrl+.': function () {
      time = videojs("#player").currentTime();
      videojs("#player").currentTime(time + 5);
      e.preventDefault();
    },
    'ctrl+1': function () {
      time = videojs("#player").currentTime();
      global_record_time("start_time");
      e.preventDefault();
    },
    'ctrl+2': function () {
      time = videojs("#player").currentTime();
      global_record_time("end_time");
      e.preventDefault();
    },
    'ctrl+3': function () {
      $('#notes').focus();
      e.preventDefault();
    },
    'ctrl+4': function () {
      $('#link_url').focus();
      e.preventDefault();
    },
    'ctrl+5': function () {
      $('#link_text').focus();
      e.preventDefault();
    },
    'ctrl+6': function () {
      $('#add_link').click();
      e.preventDefault();
    }
  });
};

Template.view_player.rendered = function() {
    load_video(998);
};

Template.editor_player.destroyed = function() {
    Meteor.Keybindings.removeAll();
    dispose_video();
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