/*
 *
 *
 */

var mongoose = require("mongoose"),
 	Campaign = mongoose.model('Campaign');


var campaignController = {};


campaignController.findCampaign =  function (requestJson){
 	campaign = Campaign.findOne({"fake_id":1});
 	console.log(campaign);
 	return campaign;
 }

campaignController.findAllCampaigns =  function (requestJson){
 	campaign = Campaign.find();
 	//console.log(campaign);
 	return campaign;
 }

campaignController.saveCampaign = function (requestJson){
 	campaign = new Campaign(requestJson);
 	campaign.save(function(error){console.log(error);});
 	return true;
 }


module.exports = campaignController;
