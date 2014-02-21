// Trials are the same thing as episodes but are distinguished because they are the result fo the trial
// I see good reason to make this a new model rather than a field attribute.

// {name:String, show_id:String, show_route:String, number:Number,
// edited:Boolean, seconds:Number, s3:Url, created_at:Date, links:[], user_id:String,
// completed_time:Date, started_time:Date}
Trials = new Meteor.Collection('trials');