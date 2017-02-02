
var influencerController = require("../middleware/influencer");
var Influencer = require("../models/influencer.js")
var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy;
var secrets = require('../../secrets')

passport.use(new FacebookStrategy({
            clientID: secrets.fb_app_id,
            clientSecret: secrets.fb_app_secret,
            callbackURL: "http://localhost:8080/auth/facebook/callback"
        },
        function(accessToken, refreshToken, profile, cb) {
            return cb(null, profile);
        }
    )
);

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Facebook profile is serialized
// and deserialized.
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

module.exports = function (router) {

    router.post('/user/login', (request, response) => {
    	console.log(`got user_details: ${JSON.stringify(request.body)}`);
    	passport.authenticate('local')(request, response, function () {
	        response.redirect('/');
	    });
    });

    router.get('/user/login', (request, response) => {
    	response.render('login');
    });

    router.get('/fb_user_test',
      function(req, res) {
        console.log(req.user);
        res.render('fb_user_test', { user: req.user });
      });

    // Redirect the user to Facebook for authentication.  When complete,
    // Facebook will redirect the user back to the application at
    //     /auth/facebook/callback
    router.get('/auth/facebook', passport.authenticate('facebook'));

    // Facebook will redirect the user to this URL after approval.  Finish the
    // authentication process by attempting to obtain an access token.  If
    // access was granted, the user will be logged in.  Otherwise,
    // authentication has failed.
    router.get('/auth/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/user/login' }),
        function(req, res) {
          console.log(`got user_details: ${JSON.stringify(req.body)}`);
          res.redirect('/fb_user_test');
        });

    router.post('/user/signup', influencerController.addInfluencer);

    router.get('/user/signup', (request, response) => {
    	response.render('signup');
    });
};


