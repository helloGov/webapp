
//TODO: How do we reuse the express object we created in app/index.js
var express = require('express');
var router = express.Router();
var locate = require('../middleware/legislators-locate.js');
var campaignController = require("../middleware/campaign");

router.get('/', function(request, response) {
	response.render('home');
	});

router.get('/locateLegislator', (request, response) => {
    //TODO: construct our request to /locateLegislator such that we can use an expressier
    // way of accessing params. request.params['latitude'] is better
    latitude = request.query.latitude;
    longitude = request.query.longitude;

    campaignController.findLegislator(latitude, longitude, response);
});

router.get('/home', (request, response) => {
  response.send('home')
});

require('./influencer.js')(router);
require('./analytics.js')(router);
require('./campaign.js')(router);
require('./user.js')(router);

module.exports = router;



