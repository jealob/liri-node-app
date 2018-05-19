require("dotenv").config();
let keys = require('./keys.js');
let fs = require("fs");
let Spotify = require('node-spotify-api');
let Twitter = require('twitter');
let spotify = new Spotify(keys.spotify);
let client = new Twitter(keys.twitter);
let request = require("request");

// Grab User's Input
let userInput = (process.argv).slice(2);
let action = userInput[0];
let mediaName = "";
for (let i = 1; i < userInput.length; i++) {
  mediaName += " " + userInput[i];
}

//Check if there is an input argument  
debugger;
if (!action) {
  // No Input action, get action and media from random.txt file
  fs.readFile("random.txt", "utf8", function (error, data) {
    // Error Handler
    if (error) {
      return console.log(error);
    }
    myData = data.split(",");
    // Pass input action and mediaName
    findAPI(myData[0], myData[1]);
  });
}
// Pass input action and mediaName
else {
  findAPI(action, mediaName);
};

function findAPI(act, media) {
  // Determine the API to call...
  console.log(`Requesting ${act}...`);
  switch (act) {
    case "my-tweets":
      twitterFunc(act);
      break;
    case "spotify-this-song":
      (media) ? spotifyFunc(act, media) : spotifyFunc(act, 'Changes.');
      break;
    case "movie-this":
      (media) ? OMDBFunc(act, media) : OMDBFunc(act, 'Mr. Nobody.');
      break;
    default:
      console.log("This shouldn't be happening");
  }
}

function twitterFunc(act) {
  console.log("Searching Twitter...");
  console.log("Getting Response...");
  client.get('statuses/user_timeline', function (error, tweets, response) {
    if (error) {
      console.log(error)
    }
    else {
      let userTweets = tweets;
      let tweetsOutput;
      tweetsOutput = `\nTweets Output
        \nTwitter Handler: @${userTweets[0].user.screen_name}
        \nUser Name: @${userTweets[0].user.name}
        \n-----Tweets-----
        `;
      for (let i in userTweets) {
        tweetsOutput += `\nTweet ${(parseInt(i)) + 1}: ${userTweets[i].text}
        \ntweet Time : ${userTweets[i].created_at}\n`;
      }
      tweetsOutput += "\n -------------------";
      console.log(tweetsOutput);
      // Outputs to log.txt
      appendOutput(tweetsOutput);
      // console.log(JSON.parse(response));  // Raw response object.
    };
  });
}

function spotifyFunc(act, media) {
  console.log("Searching Spotify...");
  console.log("Getting Response...");
  spotify.search({ type: 'track', query: media })
    .then(function (response) {
      let musicInfo = response.tracks.items[0];
      let spotifyOutput =
        `\nSpotify Output
        \nArtist(s): ${musicInfo.artists[0].name}
        \nThe Song's Name: ${musicInfo.name}
        \nAlbum : ${musicInfo.album.name}
        \nDuration (Minutes): ${parseFloat((musicInfo.duration_ms / 60000).toFixed(2))} 
        \nPreview Link from Spotify: ${musicInfo.external_urls.spotify}
        \nPopularity : ${musicInfo.popularity}
        \n -------------------`;

        console.log(spotifyOutput);
        // Outputs to log.txt
        appendOutput(spotifyOutput);
    })
    .catch(function (err) {
      console.log(err);
    });
}

function OMDBFunc(act, media) {
  console.log("Searching OMDB...");
  let queryUrl = "http://www.omdbapi.com/?t=" + media + "&y=&plot=short&apikey=trilogy";
  request(queryUrl, function (error, response, body) {
    console.log("Getting Response...");
    // If the request is successful
    if (!error && response.statusCode === 200) {
      let movieInfo = JSON.parse(body);
      // Check whether or not the movie exist
      if (!movieInfo.Error) {
        // If movie exist print movie information
        let movieOutput =
          `\nOMDB Output
        \nTitle of the movie: ${movieInfo.Title}
         \nDate the movie was Released: ${movieInfo.Released}
         \nIMDB Rating of the movie.: ${(movieInfo.Ratings[0]) ? movieInfo.Ratings[0].Value : "N/A"}
         \nRotten Tomatoes Rating of the movie.: ${(movieInfo.Ratings[1]) ? movieInfo.Ratings[1].Value : "N/A"}
         \nCountry where the movie was produced.: ${movieInfo.Country}
         \nLanguage of the movie.: ${movieInfo.Language}
         \nPlot of the movie: ${movieInfo.Plot}
         \nActors in the movie.: ${movieInfo.Actors}
         \n -------------------`;
        console.log(movieOutput);
        // Outputs to log.txt
        appendOutput(movieInfo)
      }
      else {
        // Else print value of Error"Movie not found!"
        console.log(movieInfo.Error);
      }
    }
  });
}

function appendOutput(info) {
  fs.appendFile("log.txt", info, function (err) {

    // If an error was experienced we say it.
    if (err) {
      console.log(err);
    }

    // If no error is experienced, we'll log the phrase "Content Added" to our node console.
    else {
      console.log("Content Added to log.txt!");
    }

  });
}