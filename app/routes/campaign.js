 var mongoose = require("mongoose"),
 	campaignController = require("../middleware/campaign");

module.exports = function (router) {

    router.get('/createCampaign', (request, response) => {
        console.log(`${JSON.stringify(request.user)}`);
        if(request.user){
            response.render('create');
        } else {
            response.status(301).render('unauthorized');
        }
    });

    router.post('/campaign/create', (request, response) => {
        campaignController.saveCampaign(request);
    });

    router.get('/campaignList', (request, response) => {
        campaignsPromise = campaignController.findAllCampaigns(request.body);
        campaignsPromise.then( function(result) {
            response.send(result);
        });
    });

    router.get('/campaign', (request, response) => {
        response.render('campaignDemo');
    });

    router.get('/campaign/:shortid', (request, response) => {
        campaignPromise = campaignController.findCampaign(request.params.shortid);
        campaignPromise.then( function(result) {
            response.render('campaign',{campData: result[0]});
        });
    });

    router.get('/campaigns', (request, response) => {
    	response.render('campaigns');
    });

      router.get('/campaignSuccess', (request, response) => {
        response.render('campaignSuccess');
      });

};
