 var mongoose = require("mongoose"),
 	campaignController = require("../middleware/campaign");

module.exports = function (router) {
    router.post('/campaign/create', (request, response) => {
    	console.log(request.body);
    	campaignController.saveCampaign(request.body);
    	response.send("home");
	});
};

