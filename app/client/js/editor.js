Template.editor.rendered = function() {
  videojs("#player", {"controls":true, "preload":"auto", "autoplay":false}, function(){});
}

Template.editor.destroyed = function() {
  videojs("#player").dispose();
}
