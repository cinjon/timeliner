Template.editor.rendered = function() {

}

Template.editor.helpers({
    episode_name: function() {
        return this.episode.name;
    },
    show_name: function() {
        return this.show.name;
    },
    episode_number: function() {
        return this.episode.number;
    },
    url: function() {
        return this.episode.s3;
    }
});