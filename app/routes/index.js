
//TODO: How do we reuse the express object we created in app/index.js 
var express = require('express');
var router = express.Router();
var locate = require('../middleware/legislators-locate.js');

router.get('/', function(request, response) {
	console.log("getting /");
	response.render('home');
	});

router.get('/analytics', (request, response) => {
  response.render('analytics');
});

router.get('/locateLegislator', (request, response) => {
    //TODO: construct our request to /locateLegislator such that we can use an expressier 
    // way of accessing params. request.params['latitude'] is better
    latitude = request.query.latitude;
    longitude = request.query.longitude;

    response.setHeader('Content-Type', 'application/json')
    locate.locateTheLegislator(latitude, longitude, response);
});

router.get('/home', (request, response) => {
  response.send('home')
});

require('./userViews.js')(router);
require('./influencer.js')(router);

module.exports = router;



