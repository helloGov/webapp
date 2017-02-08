/*
 *
 *
 */

var mongoose = require("mongoose"),
 	Campaign = mongoose.model('Campaign'),
    sunlight = require("sunlight-congress-api");

var campaignController = {};

campaignController.findCampaign = function (shortid) {
    var findStr = {_id : shortid};
    campaign = Campaign.find(findStr);
    return campaign;
}

campaignController.findAllCampaigns = function (requestJson) {
    campaign = Campaign.find();
    //console.log(campaign);
    return campaign;
}

campaignController.saveCampaign = function (requestJson) {
    campaign = new Campaign(requestJson);
    campaign.save(function(error){console.log(error);});
    return true;
}

campaignController.findLegislator = function (latitude, longitude, response) {

    var getRepresentative = function(legislators) {
        if (legislators.length == 0) {
            return null;
        }

        for (var legislatorIndex = 0; legislatorIndex < legislators.length; legislatorIndex++) {
          var legislator = legislators[legislatorIndex];
          if (legislator.title == "Rep") {
            return legislator;
          }
        }
        var firstLegislator = legislators[0];
        return firstLegislator;
    }

    var success = function(data) {
      var legislators = data.results;
      var representative = getRepresentative(legislators);
      var representativeFound = (representative != null);

      responseObject = {representativeFound: representativeFound,
                        representativeInfo: representative};

      response.send(JSON.stringify(responseObject));
    }

    sunlight.init("");
    sunlight.legislatorsLocate().filter("latitude", latitude)
        .filter("longitude", longitude).call(success);
}

module.exports = campaignController;
