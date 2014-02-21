Template.test_your_might.rendered = function() {
  Deps.autorun(function() {
    Meteor.subscribe('trial', Meteor.userId());
  });
}

Template.test_your_might.created = function() {
  Session.set('trial', true);
}

Template.test_your_might.destroyed = function() {
  Session.set('trial', false);
}