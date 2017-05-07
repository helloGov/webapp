const Campaign = require('../models/campaign');

module.exports = function(router) {
    // create campaign page
    router.get('/create1', (request, response) => {
        if (request.user) {
            response.render('create1', {user: request.user, logged_in: true});
        } else {
            response.redirect('/login');
        }
    });

//        router.get('/:shortid/edit', (request, response) => {
    //second step in campaign creation: preview the landing page
//    router.get('/:shortid/create2', (request, response) => {
//        if (request.user) {
//            response.render('create2', {user: request.user, campData: campaign, logged_in: true});
//        } else {
//            response.redirect('/login');
//        }
//    });

    
    // campaign list page
    router.get('/campaigns', (request, response) => {
        let hostName = `${request.protocol}://${request.host}`;
        response.render('campaigns', {user: request.user, logged_in: request.user != null, hostName: hostName});
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
                let campaignFullUrl = `${request.protocol}://${request.host}${campaign.url}`;
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

    // edit campaign page
    router.get('/:shortid/edit', (request, response) => {
        if (request.user) {
            Campaign.findById(request.params.shortid)
                .then(function(campaign) {
                    if (request.user.id === campaign.influencer) {
                        response.render('create1', {user: request.user, campData: campaign, logged_in: true});
                    } else {
                        response.status(301).render('unauthorized', {logged_in: true});
                    }
                });
        } else {
            response.status(301).render('unauthorized', {logged_in: false});
        }
    });

// copied edit bit into a bit for create2 - kerobinso
    router.get('/:shortid/create2', (request, response) => {
        if (request.user) {
            Campaign.findById(request.params.shortid)
                .then(function(campaign) {
                    if (request.user.id === campaign.influencer) {
                        response.render('create2', {user: request.user, campData: campaign, logged_in: true});
                    } else {
                        response.status(301).render('unauthorized', {logged_in: true});
                    }
                });
        } else {
            response.status(301).render('unauthorized', {logged_in: false});
        }
    });


 // copied edit bit again, into a bit for create3 - kerobinso   

    router.get('/:shortid/create3', (request, response) => {
        if (request.user) {
            Campaign.findById(request.params.shortid)
                .then(function(campaign) {
                    if (request.user.id === campaign.influencer) {
                        response.render('create3', {user: request.user, campData: campaign, logged_in: true});
                    } else {
                        response.status(301).render('unauthorized', {logged_in: true});
                    }
                });
        } else {
            response.status(301).render('unauthorized', {logged_in: false});
        }
    });

 // copied edit bit again, into a bit for create4 - kerobinso   

    router.get('/:shortid/create4', (request, response) => {
        if (request.user) {
            Campaign.findById(request.params.shortid)
                .then(function(campaign) {
                    if (request.user.id === campaign.influencer) {
                        response.render('create4', {user: request.user, campData: campaign, logged_in: true});
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
};
