Meteor.startup( function() {
  AccountsEntry.config({
    wrapLinks: true,
    homeRoute: '/',
    dashboardRoute: '/'
  });
});