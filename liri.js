require("dotenv").config();
let keys = require('./keys.js');
let Spotify = require('node-spotify-api');
let spotify = new Spotify({
    id: <your spotify client id>,
    secret: <your spotify client secret>
  });
   
  spotify.search({ type: 'track', query: 'All the Small Things' }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
   
  console.log(data); 
  });
let spotify = new spotify(keys.spotify);
let client = new Twitter (keys.twitter);