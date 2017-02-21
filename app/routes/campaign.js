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
            campaignPromise.then(function(campaign) {
                response.send(campaign._id);
            })
            .catch(function(err) {console.log(err)});
        } else {
            response.status(301).render('unauthorized');
        }
    });

    // edit campaign page
    router.get('/campaign/:shortid/edit', (request, response) => {
        if(request.user) {
            campaignPromise = campaignController.findCampaign(request.params.shortid);
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
        console.log("Here!");
        response.render('campaignDemo');
    });

    // campaign success page (at the end of campaign creation)
    router.get('/campaignSuccess', (request, response) => {
        response.render('campaignSuccess');
    });

    // campaign call page (available to all visitors)
    router.get('/:shortid', (request, response) => {
        campaignPromise = campaignController.findCampaign(request.params.shortid);
        campaignPromise.then( function(result) {
            if(result.length > 0) {
                response.render('campaign',{campData: result[0]});
            } else {
                response.status(404).render('404');
            }
        });
    });
};
