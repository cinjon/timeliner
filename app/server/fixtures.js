//bootstrap an empty db
Meteor.startup(function() {
  if (Shows.find().count() === 0) {
    var timestamp = (new Date()).getTime();

    var nextmarket_id = Shows.insert({
      name: 'NextMarket',
      home_url: 'http://nextmarket.co/pages/podcast',
      show_route: 'NextMarket',
      created_at: timestamp,
      description: "The NextMarket podcast features Michael Wolf's conversations with some of the biggest and most interesting names in tech, media and podcasting."
    });
    var commonsense_id = Shows.insert({
      name: 'Common Sense with Dan Carlin',
      home_url: 'http://www.dancarlin.com/disp.php/cs',
      show_route: 'Common-Sense-With-Dan-Carlin',
      created_at: timestamp,
      description: "Common Sense with Dan Carlin is an independent look at politics and current events from popular New Media personality Dan Carlin."
    });

    var nextmarket_66_id = Episodes.insert({
      name: 'Robert Scoble',
      home_url: 'http://nextmarket.co/blogs/conversations/10454341-66-robert-scoble-on-google-glass-his-new-book-and-the-evolution-of-tech-blogging',
      created_at: timestamp,
      updated_at: null,
      show_id: nextmarket_id,
      edited: false,
      s3: 'http://s3timeliner.s3.amazonaws.com/nextmarket_podcast/NextMarket66.mp3',
      home_notes: 'Slightly too lazy to incorporate',
      seconds: 2962,
      number: 66,
      show_route: 'NextMarket'
    });
    var commonsense_257_id = Episodes.insert({
      name: 'Monopolizing the Democracy',
      home_url: 'http://podbay.fm/show/155974141/e/1373435424',
      created_at: timestamp,
      updated_at: null,
      show_id: commonsense_id,
      edited: false,
      s3: 'http://s3timeliner.s3.amazonaws.com/common_sense_with_dan_carlin/cswdcc257.mp3',
      seconds: 2538,
      number: 257,
      show_route: 'Common-Sense-With-Dan-Carlin'
    });

    var fake_first_nextmarket_clip_id = Clips.insert({
      start: 10,
      end: 110,
      notes: "I have two rows in two containers, but I can't figure out how to reduce the bottom and top margin/padding to bring the content closer.",
      episode_id: nextmarket_66_id,
      editor_id: "Cinjon's Account",
      previous_clip_id: null,
      next_clip_id: null,
      created_at: timestamp,
      updated_at: timestamp
    });
    var fake_second_nextmarket_clip_id = Clips.insert({
      start: 300,
      end: 603,
      notes: "The future of layout in CSS, Flexbox is the latest CSS spec designed to solve common layout problems such as vertical centering.",
      episode_id: nextmarket_66_id,
      editor_id: "Cinjon's Account",
      previous_clip_id: fake_first_nextmarket_clip_id,
      next_clip_id: null,
      created_at: timestamp,
      updated_at: timestamp
    });
    Clips.update({
      id: fake_first_nextmarket_clip_id
    }, {
      $set: {
        next_clip_id: fake_second_nextmarket_clip_id
      }
    });

    var first_link_id = Links.insert({
      url: 'http://bootply.com/bootstrap-3-migration-guide',
      text: "What's New in Bootstrap 3",
      created_at: timestamp
    })
    var second_link_id = Links.insert({
      url: 'http://wrapbootstrap.com/preview/WB022B0X6',
      text: "Von - Minimalist Blog Theme",
      created_at: timestamp
    });
    var third_link_id = Links.insert({
      url: 'http://www.bizjournals.com/denver/stories/2009/04/27/daily24.html?page=all',
      text: 'John Malone Talks',
      created_at: timestamp
    });

    Clips.update({
      _id: fake_first_nextmarket_clip_id
    }, {
      $push: {
        links: {
          $each: [second_link_id, third_link_id]
        }
      }
    });
    Clips.update({
      _id: fake_second_nextmarket_clip_id
    }, {
      $push: {
        links: {
          $each: [first_link_id, third_link_id]
        }
      }
    });
    Episodes.update({
      _id: nextmarket_66_id
    }, {
      $push: {
        links: {
          $each: [first_link_id, second_link_id, third_link_id]
        }
      }
    });
  }
});
