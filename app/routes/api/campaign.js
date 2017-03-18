const express = require('express');
const router = express.Router();
const campaignController = require('../../middleware/campaign');
const Campaign = require('../../models/campaign');

// Campaign list
router.route('/campaigns')

// create new campaign
.post((request, response) => {
    if (request.user) {
        campaignController.saveCampaign(request)
            .then(function() {
                return Campaign.findByTitleAndUser(request.body.title, request.user.id);
            })
            .then(function(result) {
                response.send(result[0]._id);
            })
            .catch(function(err) { console.log(err); });
    } else {
        response.status(301).render('unauthorized', {logged_in: false});
    }
})

// fetch campaign list for a particular user
.get((request, response) => {
    if (request.user) {
        Campaign.findByUser(request.user.id)
            .then(function(result) {
                response.send(result);
            });
    } else {
        response.status(301).render('unauthorized', {logged_in: false});
    }
});

// Campaign detail
router.route('/campaigns/:campaignId')

// fetch episode
.get((request, response) => {
    // API campaign call page (available to all visitors)
    Campaign.findById(request.params.campaignId)
        .then(function(campaign) {
            if (campaign.publish) {
                response.json(campaign);
            } else {
                console.log(`Couldn't load campaign page for ${request.params.campaignId}`);
                response.status(404).send({});
            }
        })
        .catch(function(err) {
            console.log(`Couldn't load campaign page for ${request.params.campaignId}`);
            response.json(err);
        });
});

module.exports = router;
