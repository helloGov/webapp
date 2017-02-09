/*
 *
 *
 */

var mongoose = require("mongoose"),
 	Campaign = mongoose.model('Campaign');


var campaignController = {};


campaignController.findCampaign =  function (request){
 	campaign = Campaign.findOne({"fake_id":1});
 	console.log(campaign);
 	return campaign;
 }

campaignController.findAllCampaigns =  function (request){
 	campaign = Campaign.find();
 	return campaign;
 }

campaignController.saveCampaign = function (request){
 	campaign = new Campaign({title: request.body.title,
							script: request.body.script,
							thank_you: request.body.thank_you,
							learn_more: request.body.learn_more,
    						publish: request.body.publish,
    						influencer: request.user.id });
 	campaign.save(function(error){console.log(error);});
 	return true;
 }


module.exports = campaignController;
