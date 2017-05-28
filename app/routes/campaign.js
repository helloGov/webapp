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
        response.render('campaignSuccess', {
            user: request.user,
            logged_in: request.user != null
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
};
