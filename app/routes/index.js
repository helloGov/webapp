
var express = require('express');
var router = express.Router();
var locate = require('../middleware/legislators-locate.js');
console.log("initializing router");

router.get('/', function(request, response) {
	console.log("getting /");
	response.render('home', {
    	name: 'Wilson'
  		});
	});

router.get('/analytics', (request, response) => {
  response.render('analytics', {
    name: 'Taco'
  });
});

router.post('/locateLegislator', (request, response) => {
    latitude = request.body.latitude;
    longitude = request.body.longitude;

    response.setHeader('Content-Type', 'application/json')
    locate.locateTheLegislator(latitude, longitude, response);
});

router.get('/createCampaign', (request, response) => {
    response.render('create');

});



router.get('/home', (request, response) => {
  response.render('home')
});


module.exports = router;

//require('./userViews')(router);


