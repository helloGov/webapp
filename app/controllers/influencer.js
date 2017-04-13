var Signup = require('../models/signup');
var passport = require('passport');

var influencerController = {};

influencerController.addInfluencerWithFacebook = function(request, response) {
    var findStr = { email: request.body.email, signupLink: request.body.signupLink };
    Signup.find(findStr).exec()
    .then(function(influencer) {
        if (Object.keys(influencer).length !== 0) {
            passport.authenticate('facebook');
        } else {
            console.log('Influencer not found in signup database! Influencer: ' + request.body.email + ' link: ' + request.body.signupLink);
        }
    })
    .catch(function(reason) {
        console.log('Error! Could not find signup link: ' + reason);
    });
};

module.exports = influencerController;
