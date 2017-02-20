 var mongoose = require("mongoose"),
 	campaignController = require("../middleware/campaign");

module.exports = function (router) {

    // create campaign page
    router.get('/createCampaign', (request, response) => {
        console.log(`${JSON.stringify(request.user)}`);
        if(request.user) {
            response.render('create');
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
            response.status(301).render('unauthorized');
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
                    response.render('create',{campData: campaign});
                } else {
                    response.status(301).render('unauthorized');
                }
            });
        } else {
            response.status(301).render('unauthorized');
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
            response.status(301).render('unauthorized');
        }
    });

    // campaign list page
    router.get('/campaigns', (request, response) => {
        response.render('campaigns');
    });

    // fetch campaign list for a particular user
    router.get('/campaignList', (request, response) => {
        if(request.user) {
            campaignPromise = campaignController.findCampaignsByUser(request.user.id);
            campaignPromise.then(function(result) {
                response.send(result);
            });
        } else {
            response.status(301).render('unauthorized');
        }
    });

    router.get('/campaign', (request, response) => {
        response.render('campaignDemo');
    });

    // campaign success page (at the end of campaign creation)
    router.get('/campaignSuccess', (request, response) => {
        response.render('campaignSuccess');
    });

    // campaign call page (available to all visitors)
    router.get('/:shortid', (request, response) => {
        campaignPromise = campaignController.findCampaignById(request.params.shortid);
        campaignPromise.then( function(result) {
            campaign = result[0];
            if(campaign.publish) {
                response.render('campaign',{campData: campaign});
            } else {
                response.status(301).render('unauthorized');
            }
        });
    });
};
