
var influencerController = require("../middleware/influencer");
var Influencer = require("../models/influencer.js")
var passport = require('passport');

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

    router.post('/user/fb_login', (request, response) => {
        console.log(`got user_details: ${JSON.stringify(request.body)}`);
        passport.authenticate('local')(request, response, function () {
            response.redirect('/');
        });
    });

    router.get('/user/fb_login', (request, response) => {
        response.render('login');
    });

    router.post('/user/signup', influencerController.addInfluencer);

    router.get('/user/signup', (request, response) => {
    	response.render('signup');
    });
};


