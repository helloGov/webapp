/*
 *
 *
 */

var mongoose = require("mongoose"),
 	Influencer = mongoose.model('Influencer'),
    passport = require('passport');

var influencerController = {};

influencerController.findInfluencer = function (userJson) {

 	influencer = Influencer.findOne({"fake_id":1});
 	console.log(influencer);
 	return influencer;
}

influencerController.saveInfluencer = function (userJson) {
 	userJson = {username: "Josh Canaao",
				email: "jc@hellogov.org",
				bio: "asd",
				loginName: "asd",
				password: "asd",
				image: "asd"
	}
 	influencer = new Influencer(userJson);
 	influencer.save(function(error){console.log(error);});
 	return true;
}

influencerController.addInfluencer = function (request, response) {
    console.log(`got user_details: ${JSON.stringify(request.body)}`);
    Influencer.register(new Influencer({ username : request.body.username }), request.body.password, function(err, account) {
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
