 var mongoose = require("mongoose"),
 	campaignController = require("../middleware/campaign");

module.exports = function (router) {
    router.post('/campaign/create', (request, response) => {
    	campaignController.saveCampaign(request.body);
	});

    router.get('/campaignList', (request, response) => {
        campaignsPromise = campaignController.findAllCampaigns(request.body)
            console.log("testing")
        campaignsPromise.then( function(result) {
            //console.log(result);
            response.send(result);
        });
    });

    router.get('/campaign', (request, response) => {
        response.render('campaign');
    });

    router.get('/campaigns', (request, response) => {
    	response.render('campaigns');

	});
};

