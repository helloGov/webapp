const axios = require('axios');
var Campaign = require('../models/campaign');
let googleCivicInfoApiKey = require('../../conf/secrets.js').google_civic_info_api_key;
let openStatesApiKey = require('../../conf/secrets.js').openstates_api_key;

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

campaignController.findLegislator = async function (address, latitude, longitude, campaignId, response) {
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

    const getUpperBodyRepsFromGoogle = async function () {
        return axios.get(`https://www.googleapis.com/civicinfo/v2/representatives?address=${address}&roles=legislatorUpperBody&key=${googleCivicInfoApiKey}`)
            .catch(error => { console.log(error); });
    };

    const getLowerBodyRepsFromGoogle = async function () {
        return axios.get(`https://www.googleapis.com/civicinfo/v2/representatives?address=${address}&roles=legislatorLowerBody&key=${googleCivicInfoApiKey}`)
            .catch(error => { console.log(error); });
    };

    const getStateRepsFromOpenStates = async function (lat, lon, apiKey) {
        return axios.get(`https://openstates.org/api/v1/legislators/geo/?lat=${lat}&long=${lon}&apikey=${apiKey}`)
            .catch(error => { console.log(error); });
    }

    const getLegislatorForCampaignFromGoogle = function (data, title) {
        return data ? {
            title: title,
            name: data.name,
            party: data.party,
            photo_url: data.photoUrl,
            phone: data.phones[0]
        }
            : null;
    };

    const getLegislatorForCampaignFromOpenStates = function (data, title) {
        return data ? {
            title: title,
            name: data.full_name,
            party: data.party,
            photo_url: data.photo_url,
            phone: data.offices.find(office => office.phone).phone
        }
            : null;
    };

    let currentCampaign = await Campaign.findById(campaignId, 'legislature_level').catch(error => console.log(error));
    let legislatureLevels = Object.keys(currentCampaign.legislature_level).filter(lev => currentCampaign.legislature_level[lev]);
    let legislators = [];

    if (legislatureLevels.includes('federal_senate')) {
        let res = await getUpperBodyRepsFromGoogle();
        let legislatorResults = res.data.officials.slice(0, 2);
        for (let legislator of legislatorResults) {
            legislators.push(getLegislatorForCampaignFromGoogle(legislator, 'U.S. Senator'));
        }
    }
    if (legislatureLevels.includes('federal_house')) {
        let res = await getLowerBodyRepsFromGoogle();
        let legislator = res.data.officials[0];
        legislators.push(getLegislatorForCampaignFromGoogle(legislator, 'Congressperson'));
    }
    if (legislatureLevels.includes('state_senate')) {
        let res = await getStateRepsFromOpenStates(latitude, longitude, openStatesApiKey);
        let legislator = res.data[0];
        legislators.push(getLegislatorForCampaignFromOpenStates(legislator, 'State Senator'));
    }
    if (legislatureLevels.includes('state_assembly')) {
        let res = await getStateRepsFromOpenStates(latitude, longitude, openStatesApiKey);
        let legislator = res.data[1];
        legislators.push(getLegislatorForCampaignFromOpenStates(legislator, 'State Assembly Member'));
    }

    success(legislators);
};

module.exports = campaignController;
