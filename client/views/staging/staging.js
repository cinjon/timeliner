Template.staging.helpers({
  unapproved_episodes: function() {
    console.log(this);
    return Episodes.find({show_id:this.show_id, approved:false});
  }
});

Template.unapproved_episode({
  links_count: function() {
    console.log(this);
    return this.links.length;
  }
});
