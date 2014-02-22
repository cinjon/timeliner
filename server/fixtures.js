Meteor.startup(function() {
  //bootstrap an empty db
  if (Shows.find().count() === 0) {
    var timestamp = (new Date()).getTime();

    var cinjon_id = Accounts.createUser({
      email:'cinjon.resnick@gmail.com',
      password:'sharpsharksshank',
      username:'cinjon'
    });
    Roles.addUsersToRoles(cinjon_id, ['admin', 'editor', 'user-admin']);
    var matt_id = Accounts.createUser({
      email:'matthewt@gmail.com',
      password:'greenfishpray',
      username:'matt'
    });
    Roles.addUsersToRoles(matt_id, ['admin', 'editor', 'user-admin']);

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
    var fatman_id = Shows.insert({
      name:'Fat Burning Man',
      home_url:'http://www.fatburningman.com/category/podcasts/',
      show_route:'Fat-Burning-Man',
      created_at:timestamp,
      description:null,
    });
    var primal_id = Shows.insert({
      name:'Primal Blueprint Podcast',
      home_url:'http://blog.primalblueprint.com/',
      show_route:'Primal-Blueprint-Podcast',
      created_at:timestamp,
      description:"The Primal Blueprint is about helping you discover how amazingly simple and fun lifelong wellness can be."
    });
    var randomshow_id = Shows.insert({
      name:'The Random Show',
      home_url:'http://www.fourhourworkweek.com/blog/',
      show_route:'The-Random-Show',
      created_at:timestamp,
      description:null
    });

    var gottfried_id = Episodes.insert({
      name: 'Dr. Sara Gottfried',
      home_url: 'http://www.fatburningman.com/dr-sara-gottfried-hormones-for-men/',
      created_at: timestamp,
      updated_at: null,
      show_id: fatman_id,
      edited: false,
      claimer_id: null,
      s3: 'http://s3timeliner.s3.amazonaws.com/fat-burning-man/82.mp3',
      home_notes: null,
      seconds: null,
      number: 82,
      show_route: 'Fat-Burning-Man'
    });
    var supplementation = Episodes.insert({
      name: 'Supplementation',
      home_url: 'http://blog.primalblueprint.com/episode-5-supplementation-with-mark-sisson/',
      created_at: timestamp,
      updated_at: null,
      show_id: primal_id,
      edited: false,
      claimer_id: null,
      s3: 'http://s3timeliner.s3.amazonaws.com/primal-blueprint-podcast/4.mp3',
      home_notes: null,
      seconds: null,
      number: 4,
      show_route: 'Primal-Blueprint-Podcast'
    });
    var tenlaws = Episodes.insert({
      name: 'The 10 Laws',
      home_url: 'http://blog.primalblueprint.com/episode-4-the-10-laws-with-mark-sisson/',
      created_at: timestamp,
      updated_at: null,
      show_id: primal_id,
      edited: false,
      claimer_id: null,
      s3: 'http://s3timeliner.s3.amazonaws.com/primal-blueprint-podcast/5.mp3',
      home_notes: null,
      seconds: null,
      number: 5,
      show_route: 'Primal-Blueprint-Podcast'
    });
    var random_18 = Episodes.insert({
      name: 'Episode 18',
      home_url: 'http://www.fourhourworkweek.com/blog/2012/09/17/the-random-show-episode-18-start-ups-restaurants-marriage-and-sexual-performance/',
      created_at: timestamp,
      updated_at: null,
      show_id: randomshow_id,
      edited: false,
      claimer_id: null,
      s3: 'http://s3timeliner.s3.amazonaws.com/the-random-show/18.mp3',
      home_notes: null,
      seconds: null,
      number: 18,
      show_route: 'The-Random-Show'
    });
    var random_20 = Episodes.insert({
      name: 'Episode 19',
      home_url: null,
      created_at: timestamp,
      updated_at: null,
      show_id: randomshow_id,
      edited: false,
      claimer_id: null,
      s3: 'http://s3timeliner.s3.amazonaws.com/the-random-show/19.mp3',
      home_notes: null,
      seconds: null,
      number: 19,
      show_route: 'The-Random-Show'
    });
    var random_20 = Episodes.insert({
      name: 'Episode 20',
      home_url: 'http://www.fourhourworkweek.com/blog/2013/01/17/random-show-episode-20-dog-aerobics-start-ups-meditation-comic-books-and-new-years-resolutions/',
      created_at: timestamp,
      updated_at: null,
      show_id: randomshow_id,
      edited: false,
      claimer_id: null,
      s3: 'http://s3timeliner.s3.amazonaws.com/the-random-show/20.mp3',
      home_notes: null,
      seconds: null,
      number: 20,
      show_route: 'The-Random-Show'
    });
    var random_21 = Episodes.insert({
      name: 'Episode 21',
      home_url: 'http://www.fourhourworkweek.com/blog/2013/06/05/the-random-show-episode-21-smart-drugs-bitcoin-apps-fish-taint-and-more/',
      created_at: timestamp,
      updated_at: null,
      show_id: randomshow_id,
      edited: false,
      claimer_id: null,
      s3: 'http://s3timeliner.s3.amazonaws.com/the-random-show/21.mp3',
      home_notes: null,
      seconds: null,
      number: 21,
      show_route: 'The-Random-Show'
    });
    var random_22 = Episodes.insert({
      name: 'Episode 22',
      home_url: 'http://www.fourhourworkweek.com/blog/2013/08/12/the-random-show-episode-22-home-defense-start-ups-raccoon-throwing-books-and-mail-order-urine/',
      created_at: timestamp,
      updated_at: null,
      show_id: randomshow_id,
      edited: false,
      claimer_id: null,
      s3: 'http://s3timeliner.s3.amazonaws.com/the-random-show/22.mp3',
      home_notes: null,
      seconds: null,
      number: 22,
      show_route: 'The-Random-Show'
    });


    var nextmarket_66_id = Episodes.insert({
      name: 'Robert Scoble',
      home_url: 'http://nextmarket.co/blogs/conversations/10454341-66-robert-scoble-on-google-glass-his-new-book-and-the-evolution-of-tech-blogging',
      created_at: timestamp,
      updated_at: null,
      show_id: nextmarket_id,
      edited: false,
      claimer_id: null,
      s3: 'http://s3timeliner.s3.amazonaws.com/nextmarket-podcast/66.mp3',
      home_notes: null,
      seconds: 2962,
      number: 66,
      show_route: 'NextMarket'
    });
    var commonsense_257_id = Episodes.insert({
      name: 'Monopolizing the Democracy',
      home_url: 'http://www.dancarlin.com//disp.php/csarchive/Show-257---Monopolizing-the-Democracy/Egypt-Coup-David%20Brooks',
      created_at: timestamp,
      updated_at: null,
      show_id: commonsense_id,
      edited: false,
      claimer_id: null,
      s3: 'http://s3timeliner.s3.amazonaws.com/common-sense-with-dan-carlin/257.mp3',
      seconds: 2538,
      number: 257,
      show_route: 'Common-Sense-With-Dan-Carlin'
    });

  }

  update_episodes_approved();
  update_episodes_claimeid();

  var trial = Trials.findOne({user_id:'TEMPLATE_TRIAL'});
  if (!trial) {
    var trial_id = Trials.insert({
      name: 'Monopolizing the Democracy',
      created_at: timestamp,
      show_id: commonsense_id,
      edited: false,
      s3: 'http://s3timeliner.s3.amazonaws.com/common-sense-with-dan-carlin/257.mp3',
      seconds: 2538,
      number: 257,
      show_route: 'Common-Sense-With-Dan-Carlin',
      started_time: null,
      completed_time: null,
      user_id: 'TEMPLATE_TRIAL',
      links: []
    });
  }

});

var update_episodes_approved = function() {
  Episodes.update({approved:{$exists:false}}, {$set:{approved:false}}, {multi:true})
}

var update_episodes_claimeid = function() {
  Episodes.find().forEach(function(episode) {
      var claimed = episode.claimed_id;
      if ('claimed_id' in episode) {
          Episodes.update({_id:episode._id}, {$set:{claimer_id:claimed}, $unset:{claimed_id:claimed}});
      }
  });
}