open_for_business = false;

Template.home.helpers({
  shows: function() { //should only return what server decides are top shows
    return Shows.find();
  },
  edited_episodes: function() {
    return Episodes.find({show_id:this._id, edited:true});
  },
  unedited_episodes: function() {
    return Episodes.find({show_id:this._id, edited:false});
  },
  open_for_business: function() {
    return open_for_business;
  }
});
