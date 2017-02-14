var mongoose = require("mongoose"),
 	Influencer = mongoose.model('Influencer'),
    passport = require('passport');

var influencerController = {};

influencerController.findInfluencer = function (request) {

 	influencer = Influencer.findOne({_id:request.user.id});
 	return influencer;
}

influencerController.addInfluencer = function (request, response) {
    console.log(`got user_details: ${JSON.stringify(request.body)}`);
    Influencer.register(
        new Influencer({ username : request.body.username }),
        request.body.password, function(err, account) {
            if (err) {
                return response.render('signup');
                }

            passport.authenticate('local')(request, response, function () {
                response.redirect('/');
                }, function() {
                    response.redirect('/login');
                    });
            }
    );
}

module.exports = influencerController;
