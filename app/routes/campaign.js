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
            campaignController.saveCampaign(request);
        } else {
            response.status(301).render('unauthorized');
        }
    });

    // edit campaign page
    router.get('/campaign/:shortid/edit', (request, response) => {
        if(request.user) {
            campaignPromise = campaignController.findCampaign(request.params.shortid,request.user.id);
            campaignPromise.then( function(result) {
                console.log(result[0])
                response.render('create',{campData: result[0]});
            });
        } else {
            response.status(301).render('unauthorized');
        }
    });

    // delete campaign endpoint
    router.get('/campaign/:shortid/delete', (request, response) => {
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
    router.get('/campaignList', campaignController.findAllCampaigns);

    router.get('/campaign', (request, response) => {
        response.render('campaignDemo');
    });

    // campaign call page (available to all visitors)
    router.get('/:shortid', (request, response) => {
        campaignPromise = campaignController.findCampaign(request.params.shortid);
        campaignPromise.then( function(result) {
            response.render('campaign',{campData: result[0]});
        });
    });

    // campaign success page (at the end of campaign creation)
    router.get('/campaignSuccess', (request, response) => {
        response.render('campaignSuccess');
    });
};
