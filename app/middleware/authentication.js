var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var secrets = require('../../secrets');
var Influencer = require('../models/influencer');

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
                });
                influencer.save(function(err) {
                  if(err) {
                    console.log(err);  // handle errors!
                  } else {
                    console.log("saving user ...");
                    cb(null, influencer);
                  }
                });
              }
            });
        })
);

passport.use(new LocalStrategy(Influencer.authenticate()));
