// SHITTY GLOBAL HACK
global_record_time = function(id, callback) {
    //Records time from the player into the id specified
    var seconds = Math.round(videojs("#player").currentTime());
    if (seconds < 0) {
        seconds = 0;
    }
    $('#' + id).val(global_format_time(seconds));
    if (callback) {
        callback();
    }
}

global_format_time = function(seconds) { //handlebars instead?
    //assumes seconds >= 0, formats time in seconds into time in the 01:12:42 format
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

var time_hash_regex = /^(\d+h)*(\d+m)*(\d+s)*$/;
global_convert_time_to_seconds = function(time) {
    //time is in the 1h32m22s format. converts it to seconds. used with hash
    if (!time || time == '') {
        return 0;
    }

    var times = [];
    var groups = time_hash_regex.exec(time);
    for (var i = 1; i < groups.length; i++) {
        var group = groups[i];
        if (typeof group === 'undefined') {
            times.push(0);
        } else {
            times.push(parseInt(group.slice(0,-1)));
        }
    }

    return times[0]*3600 + times[1]*60 + times[2];
}