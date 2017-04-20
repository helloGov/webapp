
// TODO: How do we reuse the express object we created in app/index.js
var express = require('express');
var router = express.Router();
var campaignController = require('../controllers/campaign');
var apiRoutes = require('./api');
var secrets = require('../../secrets');
var squareProxy = require('express-http-proxy');

router.get('/', function(request, response, next) {
    if (request.user) {
        response.redirect('/home');
    } else {
        var proxyResponse = squareProxy(secrets.marketing_site_url);
        proxyResponse(request, response, next);
    }
});

router.get('/home', (request, response) => {
    if (request.user) {
        response.render('home', {user: request.user, logged_in: true});
    } else {
        response.redirect('/login');
    }
});

router.get('/admin', (request, response) => {
    // only allow admin access if user has admin field
    if (request.user && request.user.get('admin')) {
        response.render('admin', {user: request.user, logged_in: true});
    } else {
        response.redirect('/login');
    }
});

router.get('/logout', function(request, response) {
    request.logout();
    response.redirect('/');
});

router.get('/error', function(request, response) {
    response.render('error', {logged_in: false});
});

router.get('/locateLegislator', (request, response) => {
    // TODO: construct our request to /locateLegislator such that we can use an expressier
    // way of accessing params. request.params['latitude'] is better
    var latitude = request.query.latitude;
    var longitude = request.query.longitude;

    campaignController.findLegislator(latitude, longitude, response);
});

require('./user.js')(router);
require('./analytics.js')(router);
require('./campaign.js')(router);

router.use('/api', apiRoutes);

router.use(function notFound(request, response, next) {
    response.status(404).render('404', {user: request.user, logged_in: request.user != null});
});

module.exports = router;
