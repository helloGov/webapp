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

const getUpperBodyRepsFromGoogle = async function (address, apiKey) {
    return axios.get(`https://www.googleapis.com/civicinfo/v2/representatives?address=${address}&roles=legislatorUpperBody&key=${apiKey}`)
        .catch(error => { console.log(error); });
};

const getLowerBodyRepsFromGoogle = async function (address, apiKey) {
    return axios.get(`https://www.googleapis.com/civicinfo/v2/representatives?address=${address}&roles=legislatorLowerBody&key=${apiKey}`)
        .catch(error => { console.log(error); });
};

const getStateRepsFromOpenStates = async function (lat, lon, apiKey) {
    return axios.get(`https://openstates.org/api/v1/legislators/geo/?lat=${lat}&long=${lon}&apikey=${apiKey}`)
        .catch(error => { console.log(error); });
};

const validateApiResults = function (results, legislatureLevel) {
    switch (legislatureLevel) {
        case ('federal_senate'):
            if (!results || !results.data || !results.data.officials) {
                return [null];
            } else {
                let reps = results.data.officials.slice(0, 2);
                return reps.length > 0 ? reps : [null];
            }
        case ('federal_house'):
            if (!results || !results.data || !results.data.officials) {
                return null;
            } else {
                return results.data.officials[0] || null;
            }
        case ('state_senate'):
            if (!results || !results.data) {
                return null;
            } else {
                return results.data[0] || null;
            }
        case ('state_assembly'):
            if (!results || !results.data) {
                return null;
            } else {
                return results.data[1] || null;
            }
        default:
            return null;
    }
};

const getLegislatorForCampaignFromGoogle = function (data, title) {
    return data ? {
        title: title,
        name: data.name,
        party: data.party,
        photo_url: data.photoUrl,
        phone: data.phones[0],
        legislatorFound: true
    }
        : {
            title: title,
            legislatorFound: false
        };
};

const getLegislatorForCampaignFromOpenStates = function (data, title) {
    return data ? {
        title: title,
        name: data.full_name,
        party: data.party,
        photo_url: data.photo_url,
        phone: data.offices.find(office => office.phone).phone,
        legislatorFound: true
    }
        : {
            title: title,
            legislatorFound: false
        };
};

campaignController.findLegislator = async function (address, latitude, longitude, campaignId, response) {
    var success = function (representatives, campaign) {
        var representativeFound = (representatives.length > 0);
        var responseObject = {
            representativeFound: representativeFound,
            representativeInfo: representatives,
            campaign: campaign,
        };
        response.send(JSON.stringify(responseObject));
    };

    let currentCampaign = await Campaign.findById(campaignId).catch(error => console.log(error));
    let legislatureLevels = Object.keys(currentCampaign.legislature_level).filter(lev => currentCampaign.legislature_level[lev]);
    let legislators = [];

    if (legislatureLevels.includes('federal_senate')) {
        let res = await getUpperBodyRepsFromGoogle(address, googleCivicInfoApiKey);
        let legislatorResults = validateApiResults(res, 'federal_senate');
        for (let legislator of legislatorResults) {
            legislators.push(getLegislatorForCampaignFromGoogle(legislator, 'U.S. Senator'));
        }
    }
    if (legislatureLevels.includes('federal_house')) {
        let res = await getLowerBodyRepsFromGoogle(address, googleCivicInfoApiKey);
        let legislator = validateApiResults(res, 'federal_house');
        legislators.push(getLegislatorForCampaignFromGoogle(legislator, 'Congressperson'));
    }
    if (legislatureLevels.includes('state_senate')) {
        let res = await getStateRepsFromOpenStates(latitude, longitude, openStatesApiKey);
        let legislator = validateApiResults(res, 'state_senate');
        legislators.push(getLegislatorForCampaignFromOpenStates(legislator, 'State Senator'));
    }
    if (legislatureLevels.includes('state_assembly')) {
        let res = await getStateRepsFromOpenStates(latitude, longitude, openStatesApiKey);
        let legislator = validateApiResults(res, 'state_assembly');
        legislators.push(getLegislatorForCampaignFromOpenStates(legislator, 'State Assembly Member'));
    }

    success(legislators, currentCampaign);
};

module.exports = campaignController;
