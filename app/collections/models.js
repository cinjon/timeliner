//All editing permissions go through the User model that comes in Meteor

// Shows - {name:String, home_page:url, description:String, s3:Url, created_at:Date, route:String} //route looks like show name with spaces replaced by -, e.g. Joe-Rogan-Experience
Shows = new Meteor.Collection('shows');

// Episode - {name:String, home_url:String, show_id:String, number:Number, edited:Boolean, seconds:Number, s3:Url, created_at:Date, updated_at:Date, home_notes:String}
Episodes = new Meteor.Collection('episodes');

// Clips - {start:Number, end:Number, notes:String, episode_id:String, editor_id:String, previous_clip_id:String, next_clip_id:String, created_at:Date, updated_at:Date}
Clips = new Meteor.Collection('clips');

// Links - {url:String, clip_id:String, episode_id:String, text:String, created_at:String}
Links = new Meteor.Collection('links');

// Tags - {name:String}
Tags = new Meteor.Collection('tags');