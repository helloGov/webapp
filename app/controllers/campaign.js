const axios = require('axios');
var Campaign = require('../models/campaign');
let googleCivicInfoApiKey = require('../../conf/secrets.js').google_civic_info_api_key;

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

campaignController.findLegislator = async function (address, campaignId, response) {
    var getRepresentative = function (legislators) {
        if (legislators.length === 0) {
            return null;
        }

        let legislator = legislators[0];
        if (!legislator.phone) {
            return null;
        }
        return legislator;
    };

    var success = function (legislators) {
        var representative = getRepresentative(legislators);
        var representativeFound = (representative != null);
        var responseObject = {
            representativeFound: representativeFound,
            representativeInfo: representative
        };
        response.send(JSON.stringify(responseObject));
    };

    const getUpperBodyReps = async function () {
        return axios.get(`https://www.googleapis.com/civicinfo/v2/representatives?address=${address}&roles=legislatorUpperBody&key=${googleCivicInfoApiKey}`)
            .catch(error => { console.log(error); });
    };

    const getLowerBodyReps = async function () {
        return axios.get(`https://www.googleapis.com/civicinfo/v2/representatives?address=${address}&roles=legislatorLowerBody&key=${googleCivicInfoApiKey}`)
            .catch(error => { console.log(error); });
    };

    let currentCampaign = await Campaign.findById(campaignId, 'legislature_level');
    let legislatureLevels = Object.keys(currentCampaign.legislature_level).filter(lev => currentCampaign.legislature_level[lev]);
    let legislators = [];

    if (legislatureLevels.includes('state_senate')) {
        let res = await getUpperBodyReps();
        let legislator = res.data.officials[2];
        legislators.push({
            title: 'State Senator',
            name: legislator.name,
            party: legislator.party,
            photo_url: legislator.photoUrl,
            phone: legislator.phones[0]
        });
    }
    if (legislatureLevels.includes('state_assembly')) {
        let res = await getLowerBodyReps();
        let legislator = res.data.officials[1];
        legislators.push({
            title: 'State Assembly Member',
            name: legislator.name,
            party: legislator.party,
            photo_url: legislator.photoUrl,
            phone: legislator.phones[0]
        });
    }

    success(legislators);
};

module.exports = campaignController;
