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
                user: request.user.id,
                legislature_level: {
                    federal_senate: request.body.legislature_level.federal_senate,
                    federal_house: request.body.legislature_level.federal_house,
                    state_senate: request.body.legislature_level.state_senate,
                    state_assembly: request.body.legislature_level.state_assembly
                },
                state: request.body.state
            });
            campaign.save()
                .then(function (campaign) {
                    response.send({ result: campaign });
                })
                .catch(function (err) {
                    console.log(err);
                });
        } else {
            response.status(401).end();
        }
    })

    // fetch campaign list for a particular user
    .get((request, response) => {
        if (request.user) {
            let sort = request.query.sort;
            Campaign.findByUser(request.user.id, sort)
                .then(function (result) {
                    response.send(result);
                });
        } else {
            response.status(401).end();
        }
    });

// Campaign detail
router.route('/campaigns/:campaignId')

    // fetch campaign
    .get((request, response) => {
        let userId = request.user ? request.user.id : null;
        Campaign.findForRequestingUser(request.params.campaignId, userId)
            .then(function (campaign) {
                if (!campaign) {
                    return response.status(404).send({});
                }
                return response.json(campaign);
            })
            .catch(function (err) {
                console.log(`Couldn't load campaign page for ${request.params.campaignId}`);
                response.json(err);
            });
    })

    // update campaign
    .patch((request, response) => {
        Campaign.findOneAndUpdate({ '_id': request.params.campaignId, 'user': request.user.id }, request.body, { new: true })
            .then(function (campaign) {
                response.json({ result: campaign });
            })
            .catch(function (err) {
                response.json(err);
            });
    })

    .delete((request, response) => {
        if (request.user) {
            Campaign.findById(request.params.campaignId)
                .then(function (campaign) {
                    if (!campaign) {
                        return response.status(404).end();
                    }
                    campaign.delete(request.user.id)
                        .then(function () {
                            return response.status(200).end();
                        })
                        .catch(function () {
                            response.status(401).end();
                        });
                });
        } else {
            response.status(401).end();
        }
    });

module.exports = router;
