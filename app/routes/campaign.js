 var mongoose = require("mongoose"),
 	campaignController = require("../middleware/campaign");

module.exports = function (router) {

    // create campaign page
    router.get('/createCampaign', (request, response) => {
        console.log(`${JSON.stringify(request.user)}`);
        if(request.user) {
            response.render('create', {logged_in: true});
        } else {
            response.redirect('/login');
        }
    });

    // save new campaign
    router.post('/campaign/create', (request, response) => {
        if(request.user) {
            campaignPromise = campaignController.saveCampaign(request);
            campaignPromise.then(function() {
                return campaignController.findCampaignByTitleAndUser(request.body.title, request.user.id);
            })
            .then(function(result) {
                response.send(result[0]._id);
            })
            .catch(function(err) {console.log(err)});
        } else {
            response.status(301).render('unauthorized', {logged_in: false});
        }
    });

    // edit campaign page
    router.get('/:shortid/edit', (request, response) => {
        if(request.user) {
            campaignPromise = campaignController.findCampaignById(request.params.shortid);
            campaignPromise.then(function(result) {
                campaign = result[0];
                console.log(campaign);
                if(request.user.id==campaign.influencer) {
                    response.render('create',{campData: campaign, logged_in: true});
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
        if(request.user) {
            campaignPromise = campaignController.deleteCampaign(request.params.shortid,request.user.id);
            campaignPromise.then( function(result) {
                response.redirect('/campaigns');
            });
        } else {
            response.status(301).render('unauthorized', {logged_in: false});
        }
    });

    // campaign list page
    router.get('/campaigns', (request, response) => {
        response.render('campaigns', {logged_in: request.user != null});
    });

    // fetch campaign list for a particular user
    router.get('/campaignList', (request, response) => {
        if(request.user) {
            campaignPromise = campaignController.findCampaignsByUser(request.user.id);
            campaignPromise.then(function(result) {
                response.send(result);
            });
        } else {
            response.status(301).render('unauthorized', {logged_in: false});
        }
    });

    router.get('/campaign', (request, response) => {
        response.render('campaignDemo', {logged_in: request.user != null});
    });

    // campaign success page (at the end of campaign creation)
    router.get('/campaignSuccess', (request, response) => {
        response.render('campaignSuccess', {logged_in: request.user != null});
    });

    // campaign call page (available to all visitors)
    router.get('/:shortid', (request, response) => {
        campaignPromise = campaignController.findCampaignById(request.params.shortid);
        campaignPromise.then( function(result) {

            if(result.length > 0 && result[0].publish) {
                response.render('campaign',{campData: result[0], logged_in: request.user != null});
            } else {
                console.log(`Couldn't load campaign page for ${request.params.shortid}`);
                response.status(404).render('404', {logged_in: request.user != null});
            }
        });
    });

    // API campaign call page (available to all visitors)
    router.get('/api/campaign/:shortid', (request, response) => {
        campaignPromise = campaignController.findCampaignById(request.params.shortid);
        campaignPromise.then( function(result) {

            if(result.length > 0 && result[0].publish) {
                response.send(result[0]);
            } else {
                console.log(`Couldn't load campaign page for ${request.params.shortid}`);
                response.status(404).send({});
            }
        });
    });

    // campaign thank-you page (available to all visitors after completing call)
    router.get('/:shortid/thank-you', (request, response) => {
        campaignPromise = campaignController.findCampaignById(request.params.shortid);
        campaignPromise.then( function(result) {
            if(result.length > 0) {
                response.render('thankYou',{campData: result[0], logged_in: request.user != null});
            } else {
                console.log(`Couldn't find thank you page for ${request.params.shortid}`);
                response.status(404).render('404', {logged_in: request.user != null});
            }
        });
    });
};
