/*
 *
 *
 */

var mongoose = require("mongoose"),
 	Influencer = mongoose.model('Influencer');


var influencerController = {};


influencerController.findInfluencer =  function (userJson){

 	influencer = Influencer.findOne({"fake_id":1});
 	console.log(influencer);
 	return influencer;
 }

 
 influencerController.saveInfluencer = function (userJson){
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


module.exports = influencerController;
