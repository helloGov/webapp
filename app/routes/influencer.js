var influencerController = require("../middleware/influencer")
var Influencer = require("../models/influencer.js")
var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var auth = require("../middleware/authentication.js");

module.exports = function (router) {

    router.post('/signup', influencerController.addInfluencer);

    router.get('/signup/:signupId', (request, response) => {
        if (!request.user) {
            response.render('signup', {logged_in: request.user != null});
        } else {
            response.redirect('/');
        }
    });

    router.post('/login', (request, response) => {
        passport.authenticate('local')(request, response, function () {
            response.redirect('/');
        });
    });

    router.get('/login', (request, response) => {
        response.render('login', {logged_in: request.user != null});
    });

    // Redirect the user to Facebook for authentication.  When complete,
    // Facebook will redirect the user back to the application at
    //     /auth/facebook/callback
    router.get('/auth/facebook', influencerController.addInfluencerWithFacebook);

    // Facebook will redirect the user to this URL after approval.  Finish the
    // authentication process by attempting to obtain an access token.  If
    // access was granted, the user will be logged in.  Otherwise,
    // authentication has failed.
    router.get('/auth/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/login' }),
        function(req, res) {
          console.log(`got user_details: ${JSON.stringify(req.body)}`);
          res.redirect('/');
        });
};

