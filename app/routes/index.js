
//TODO: How do we reuse the express object we created in app/index.js
var express = require('express');
var router = express.Router();
var campaignController = require("../middleware/campaign");
var influencerController = require("../middleware/influencer");

router.get('/', function(request, response) {
    if(request.user){
        response.redirect('/home');
    } else {
        response.redirect('/login');
    }
});

router.get('/home', (request, response) => {
    if(request.user){
        influencerPromise = influencerController.findInfluencer(request);
        influencerPromise.then(function(result) {
            console.log("rendering for influencer: " + JSON.stringify(result))
            response.render('home', {influencer: result});
        });
    } else {
        response.redirect('/login');
    }
});

router.get('/logout', function(request, response){
      request.logout();
      response.redirect('/');
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

router.use(function timeLog (request, response, next) {
  response.status(404).render('404');
});

module.exports = router;



