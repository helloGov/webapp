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
 	campaign = new Campaign({title: request.title,
							script: { type: String, trim: true },
							thank_you: request.thank_you,
							learn_more: request.learn_more,
    						publish: request.publish,
    						influencer: request.user });
 	campaign.save(function(error){console.log(error);});
 	return true;
 }


module.exports = campaignController;
