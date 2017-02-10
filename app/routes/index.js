
//TODO: How do we reuse the express object we created in app/index.js
var express = require('express');
var router = express.Router();
var campaignController = require("../middleware/campaign");

router.get('/', function(request, response) {
    if(request.user){
        response.render('home');
    } else {
        response.render('login');
    }
});

router.get('/home', (request, response) => {
    if(request.user){
        response.render('home');
    } else {
        response.render('login');
    }
});

router.get('/locateLegislator', (request, response) => {
    //TODO: construct our request to /locateLegislator such that we can use an expressier
    // way of accessing params. request.params['latitude'] is better
    latitude = request.query.latitude;
    longitude = request.query.longitude;

    campaignController.findLegislator(latitude, longitude, response);
});

require('./influencer.js')(router);
require('./analytics.js')(router);
require('./campaign.js')(router);

module.exports = router;



