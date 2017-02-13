
var mongoose = require("mongoose"),
 	Campaign = mongoose.model('Campaign'),
    sunlight = require("sunlight-congress-api");

var campaignController = {};

campaignController.findCampaign = function (shortid) {
    var findStr = {_id: shortid};
    campaign = Campaign.find(findStr);
    return campaign;
}

campaignController.findCampaignByTitleAndUser = function (title,userid) {
    var findStr = {title: title, influencer: userid};
    campaign = Campaign.find(findStr);
    return campaign;
}

campaignController.deleteCampaign = function (shortid,userid) {
    var findStr = {_id: shortid, influencer: userid};
    campaign = Campaign.find(findStr).remove().exec();
    console.log(campaign);
    return campaign;
}

campaignController.findAllCampaigns = function (request, response) {
  if (request.user) {
    campaigns = Campaign.find({influencer: request.user.id});
    campaigns.then(function(result){
      response.send(result);
    })
  } else {
    response.status(301).send({});
  }
};

campaignController.saveCampaign = function (request, response){
    var findStr = {_id: request.body.shortid, influencer: request.user.id};
    var shortid = "";
    findCamp = Campaign.find(findStr).exec()
        .then(function(result) {
            if(result.length > 0) {
                console.log("Updating")
                promise = Campaign.update(findStr,{title: request.body.title,
                    script: request.body.script,
                    thank_you: request.body.thank_you,
                    learn_more: request.body.learn_more,
                    publish: request.body.publish,
                    influencer: request.user.id });
            } else {
                console.log("Creating new")
                campaign = new Campaign({title: request.body.title,
                    script: request.body.script,
                    thank_you: request.body.thank_you,
                    learn_more: request.body.learn_more,
                    publish: request.body.publish,
                    influencer: request.user.id });
                // return campaign.save(function(error){console.log(error);});
                promise = campaign.save();
                // promise = campaign.save(function (err, product, numAffected) {
                //     shortid = product._id;
                //     return shortid;
                // });
            }

            return promise;
        });
        // .then(function() {
        //     promise_find = Campaign.find(findStr).exec();
        //     return promise_find;
        // });

    // return shortid;
    return findCamp;
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
