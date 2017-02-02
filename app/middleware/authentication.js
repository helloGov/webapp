var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var secrets = require('../../secrets');
var Influencer = require('../models/influencer');

module.exports = passport.use(new FacebookStrategy({
            clientID: secrets.fb_app_id,
            clientSecret: secrets.fb_app_secret,
            callbackURL: "http://localhost:8080/auth/facebook/callback"
        },
        function(accessToken, refreshToken, profile, cb) {
            return cb(null, profile);
        }
    )
);

passport.use(new LocalStrategy(Influencer.authenticate()));
