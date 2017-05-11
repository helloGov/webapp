const Campaign = require('../models/campaign');

module.exports = function(router) {
    // create campaign page
    router.get('/create', (request, response) => {
        if (request.user) {
            response.render('create', {user: request.user, logged_in: true});
        } else {
            response.redirect('/login');
        }
    });

    // campaign call page (available to all visitors)
    router.get('/:shortid', (request, response) => {
        Campaign.findOne({_id: request.params.shortid, publish: true})
            .then(function(campaign) {
                if (!campaign) {
                    return response.status(404).render('404', {user: request.user, logged_in: request.user != null});
                }
                response.render('campaign', {user: request.user, campData: campaign, logged_in: request.user != null});
            });
    });

    // campaign success page (at the end of campaign creation)
    router.get('/:shortid/success', (request, response) => {
        Campaign.findOne({_id: request.params.shortid, publish: true})
            .then(function(campaign) {
                let campaignFullUrl = `${request.protocol}://${request.hostname}${campaign.url}`;
                response.render('campaignSuccess', {
                    user: request.user,
                    logged_in: request.user != null,
                    campaign: campaign,
                    campaignFullUrl: campaignFullUrl
                });
            });
    });

    router.get('/:shortid/analytics', function(request, response) {
        response.render('analytics', {user: request.user, logged_in: request.user != null});
    });

    // campaign thank-you page (available to all visitors after completing call)
    router.get('/:shortid/thank-you', (request, response) => {
        let userId = request.user ? request.user.id : null;
        Campaign.findForRequestingUser(request.params.shortid, userId)
            .then(function(campaign) {
                if (campaign) {
                    response.render('thankYou', {user: request.user, campData: campaign, logged_in: request.user != null});
                } else {
                    console.log(`Couldn't find thank you page for ${request.params.shortid}`);
                    response.status(404).render('404', {user: request.user, logged_in: request.user != null});
                }
            });
    });

    // edit campaign page
    router.get('/:shortid/edit', (request, response) => {
        if (request.user) {
            response.render('create', {user: request.user, logged_in: true});
        } else {
            response.redirect('/login');
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
                            response.redirect('/home');
                        })
                        .catch(function() {
                            response.status(301).render('unauthorized', {logged_in: true});
                        });
                });
        } else {
            response.status(301).render('unauthorized', {logged_in: false});
        }
    });
};
