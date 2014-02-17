Template.base.events ({
  'click #togglesidebar': function(e, tmpl) {
    var primary = $("#primary");
    var secondary = $("#secondary");
    if (primary.hasClass("col-sm-9")) {
      primary.removeClass("col-sm-9");
      primary.addClass("col-sm-12");
      secondary.css('display', 'none');
    } else {
      primary.removeClass("col-sm-12");
      primary.addClass("col-sm-9");
      secondary.css('display', 'inline-block');
    }
  }
});


Template.base.helpers({
  user_is_editor: function () {
    if ( Roles.userIsInRole(Meteor.userId(), ['editor']) ) {
      return true;
    }
  },

  user_is_admin: function () {
    if ( Roles.userIsInRole(Meteor.userId(), ['admin']) ) {
      return true;
    }
  }
});