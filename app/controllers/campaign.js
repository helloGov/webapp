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
    var getRepresentatives = function (legislators) {
        if (legislators.length === 0) {
            return null;
        }

        return legislators;
    };

    var success = function (legislators) {
        var representatives = getRepresentatives(legislators);
        var representativeFound = (representatives.length > 0);
        var responseObject = {
            representativeFound: representativeFound,
            representativeInfo: representatives
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

    const getLegislatorForCampaign = function (data, title) {
        return data ? {
            title: title,
            name: data.name,
            party: data.party,
            photo_url: data.photoUrl,
            phone: data.phones[0]
        }
            : null;
    };

    let currentCampaign = await Campaign.findById(campaignId, 'legislature_level');
    let legislatureLevels = Object.keys(currentCampaign.legislature_level).filter(lev => currentCampaign.legislature_level[lev]);
    let legislators = [];

    if (legislatureLevels.includes('federal_senate')) {
        let res = await getUpperBodyReps();
        let legislatorResults = res.data.officials.slice(0, 2);
        for (let legislator of legislatorResults) {
            legislators.push(getLegislatorForCampaign(legislator, 'U.S. Senator'));
        }
    }
    if (legislatureLevels.includes('federal_house')) {
        let res = await getLowerBodyReps();
        let legislator = res.data.officials[0];
        legislators.push(getLegislatorForCampaign(legislator, 'Congressperson'));
    }
    if (legislatureLevels.includes('state_senate')) {
        let res = await getUpperBodyReps();
        let legislator = res.data.officials[2];
        legislators.push(getLegislatorForCampaign(legislator, 'State Senator'));
    }
    if (legislatureLevels.includes('state_assembly')) {
        let res = await getLowerBodyReps();
        let legislator = res.data.officials[1];
        legislators.push(getLegislatorForCampaign(legislator, 'State Assembly Member'));
    }

    success(legislators);
};

module.exports = campaignController;
