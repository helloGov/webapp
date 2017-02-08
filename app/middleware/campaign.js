/*
 *
 *
 */

var mongoose = require("mongoose"),
 	Campaign = mongoose.model('Campaign');

var campaignController = {};

campaignController.findCampaign = function (requestJson) {
    campaign = Campaign.findOne({"fake_id":1});
    console.log(campaign);
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
    var sunlight = require("sunlight-congress-api");
    var exphbs = require('express-handlebars');
    var hbs = exphbs.create({ /* config */ });

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
