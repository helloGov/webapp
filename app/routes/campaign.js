const Campaign = require('../models/campaign');

module.exports = function(router) {
    // create campaign page
    router.get('/createCampaign', (request, response) => {
        if (request.user) {
            response.render('create', {user: request.user, logged_in: true});
        } else {
            response.redirect('/login');
        }
    });

    // edit campaign page
    router.get('/:shortid/edit', (request, response) => {
        if (request.user) {
            Campaign.findById(request.params.shortid)
                .then(function(campaign) {
                    if (request.user.id === campaign.influencer) {
                        response.render('create', {user: request.user, campData: campaign, logged_in: true});
                    } else {
                        response.status(301).render('unauthorized', {logged_in: true});
                    }
                });
        } else {
            response.status(301).render('unauthorized', {logged_in: false});
        }
    });

    // delete campaign endpoint
    router.get('/:shortid/delete', (request, response) => {
        if (request.user) {
            Campaign.findById(request.params.shortid)
                .then(function(campaign) {
                    if (!campaign) {
                        response.status(404).render('404', {logged_in: true});
                        return;
                    }
                    campaign.delete(request.user.id)
                        .then(function() {
                            response.redirect('/campaigns');
                        })
                        .catch(function() {
                            response.status(301).render('unauthorized', {logged_in: true});
                        });
                });
        } else {
            response.status(301).render('unauthorized', {logged_in: false});
        }
    });

    // campaign list page
    router.get('/campaigns', (request, response) => {
        response.render('campaigns', {user: request.user, logged_in: request.user != null});
    });

    // campaign success page (at the end of campaign creation)
    router.get('/campaignSuccess', (request, response) => {
        response.render('campaignSuccess', {user: request.user, logged_in: request.user != null});
    });

    // campaign call page (available to all visitors)
    router.get('/:shortid', (request, response) => {
        Campaign.findById(request.params.shortid)
            .then(function(campaign) {
                if (campaign.publish) {
                    response.render('campaign', {user: request.user, campData: campaign, logged_in: request.user != null});
                } else {
                    console.log(`Couldn't load campaign page for ${request.params.shortid}`);
                    response.status(404).render('404', {user: request.user, logged_in: request.user != null});
                }
            });
    });

    // campaign thank-you page (available to all visitors after completing call)
    router.get('/:shortid/thank-you', (request, response) => {
        Campaign.findById(request.params.shortid)
            .then(function(campaign) {
                if (campaign) {
                    response.render('thankYou', {user: request.user, campData: campaign, logged_in: request.user != null});
                } else {
                    console.log(`Couldn't find thank you page for ${request.params.shortid}`);
                    response.status(404).render('404', {user: request.user, logged_in: request.user != null});
                }
            });
    });
};
