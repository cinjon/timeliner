Template.queue.items = function() {
    console.log(Session.get('queue_data'));
    return Session.get('queue_data');
}