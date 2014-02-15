Deps.autorun( function () {
  if ( Meteor.userId() ) {
    log.info("HELLO");
  } else {
    log.info("GOODBYE");
  }
});