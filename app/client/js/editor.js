Template.editor.rendered = function() {

}

Template.editor.episode_name = function() {
    if (Session.get('episode')) {
        return Session.get('episode').name;
    }
}

Template.editor.episode_number = function() {
    if (Session.get('episode')) {
        return Session.get('episode').number;
    }
}

Template.editor.url = function() {
    if (Session.get('episode')) {
        return Session.get('episode').s3;
    }
}

Template.editor.show_name = function() {
    if (Session.get('show')) {
        return Session.get('show').name;
    }
}

Template.player.url = function() {
    if (Session.get('episode')) {
        return Session.get('episode').s3;
    }
}