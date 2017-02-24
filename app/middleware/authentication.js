var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var secrets = require('../../secrets');
var Influencer = require('../models/influencer');
var fs = require('fs');
var request = require('request');

getFacebookPhoto = function(influencer){
  influencerID = influencer.id;
  oauthID = influencer.oauthID;
  photoJsonUrl = `http://graph.facebook.com/v2.8/${oauthID}/picture?type=large&redirect=false`;
  photoPath = `public/images/influencers/${influencerID}.jpg`;

  request(photoJsonUrl, function(error, response, body){
    if (!error && response.statusCode == 200) {
      photoJson = JSON.parse(body)
      photoUrl = photoJson.data.url;
      request.head(photoUrl, function(err, res, body){
        request(photoUrl).pipe(fs.createWriteStream(photoPath)).on('close', function(){
          console.log(`photo saved at ${photoPath}`);
        });
      });
    }
  });

}

getFaceBookPhotoUrl = function(){
}

module.exports = passport.use(new FacebookStrategy({
            clientID: secrets.fb_app_id,
            clientSecret: secrets.fb_app_secret,
            callbackURL: secrets.fb_callback_url
        },
        function(accessToken, refreshToken, profile, cb) {
            Influencer.findOne({ oauthID: profile.id }, function(err, influencer) {
              if(err) {
                console.log(err);  // handle errors!
              }
              if (!err && influencer !== null) {
                cb(null, influencer);
              } else {
                influencer = new Influencer({
                  oauthID: profile.id,
                  name: profile.displayName
                  ,image: "" ///TODO -- using a placeholder for now
                });
                influencer.save(function(err, result) {
                  if(err) {
                    console.log(err);  // handle errors!
                  } else {
                    console.log("saving user ...");
                    getFacebookPhoto(result);
                    cb(null, influencer);
                  }
                });
              }
            });
        })
);

passport.use(new LocalStrategy(Influencer.authenticate()));
