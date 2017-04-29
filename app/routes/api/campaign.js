const express = require('express');
const router = express.Router();
const Campaign = require('../../models/campaign');

// Campaign list
router.route('/campaigns')

// create new campaign
.post((request, response) => {
    if (request.user) {
        let campaign = new Campaign({
            title: request.body.title,
            script: request.body.script,
            thank_you: request.body.thank_you,
            learn_more: request.body.learn_more,
            publish: request.body.publish,
            influencer: request.user.id
        });
        campaign.save()
            .then(function(campaign) {
                response.send({result: campaign});
            })
            .catch(function(err) {
                console.log(err);
            });
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

// fetch campaign
.get((request, response) => {
    // API campaign call page (available to all visitors)
    Campaign.findOne({_id: request.params.campaignId, publish: true})
        .then(function(campaign) {
            if (!campaign) {
                response.status(404).send({});
            }
            response.json(campaign);
        })
        .catch(function(err) {
            console.log(`Couldn't load campaign page for ${request.params.campaignId}`);
            response.json(err);
        });
})

// update campaign
.patch((request, response) => {
    Campaign.findOneAndUpdate({'_id': request.params.campaignId, 'influencer': request.user.id}, request.body, {new: true})
        .then(function(campaign) {
            response.json({result: campaign});
        })
        .catch(function(err) {
            response.json(err);
        });
});

module.exports = router;
