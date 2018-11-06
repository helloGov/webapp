const axios = require("axios");
var Campaign = require('../models/campaign');
var openstatesApiKey = require("../../conf/secrets.js").openstates_api_key;

var campaignController = {};

// not used for now, but we probably want to create a page for this
campaignController.findAllCampaigns = function (request, response) {
    if (request.user) {
        var campaigns = Campaign.find({});
        campaigns.then(function (result) {
            response.send(result);
        });
    } else {
        response.status(301).send({});
    }
};

campaignController.findLegislator = function (latitude, longitude, response) {
    var getRepresentative = function (legislators) {
        if (legislators.length === 0) {
            return null;
        }

        // for (var legislatorIndex = 0; legislatorIndex < legislators.length; legislatorIndex++) {
        //     var legislator = legislators[legislatorIndex];
        //     if (legislator.title === 'Rep') {
        //         return legislator;
        //     }
        // }
        var firstLegislator = legislators[0];
        return firstLegislator;
    };

    var success = function (data) {
        var legislators = data.data;
        var representative = getRepresentative(legislators);
        var representativeFound = (representative != null);
        var responseObject = {
            representativeFound: representativeFound,
            representativeInfo: representative
        };
        response.send(JSON.stringify(responseObject));
    };

    axios.get(`https://openstates.org/api/v1/legislators/geo/?lat=${latitude}&long=${longitude}&apikey=${openstatesApiKey}`)
        .then(res => success(res))
        .catch(error => { console.log(error) });
};

module.exports = campaignController;
