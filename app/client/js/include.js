var format_time = function(seconds) { //handlebars instead?
    //assumes seconds >= 0
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
    ret = '';
    if (time < 10) {
        ret += "0";
    }
    ret += time.toString();
    return ret;
}
