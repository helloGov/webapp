
//TODO: How do we reuse the express object we created in app/index.js
var express = require('express');
var router = express.Router();
var campaignController = require("../middleware/campaign");
var influencerController = require("../middleware/influencer");
var apiRoutes = require('./api')
var httpProxy = require('http-proxy');
var squareProxy = httpProxy.createProxyServer({
//    xfwd: true
//    changeOrigin: true
});
var expressSquareProxy = require('express-http-proxy');
var secrets = require('../../secrets');
var util = require('util');
var url = require('url');

squareProxy.on('proxyReq', function(proxyReq, req, res, options) {
  var urlObj = url.parse(req.url);
  //console.log("request ua to us: " + JSON.stringify(req.headers['user-agent']));    
  //console.log("request header to square proxy: " + JSON.stringify(proxyReq.headers));
  //console.log("Using util.inspect on proxyReq: " + util.inspect(proxyReq));
  //console.log("Using util.inspect on req: " + util.inspect(req));
  proxyReq.setHeader('user-agent', JSON.stringify(req.headers['user-agent']));
  proxyReq.setHeader('host', secrets.marketing_site_url);
  proxyReq.setHeader('url', secrets.marketing_site_url);
  //console.log("modified request header to square proxy: " + JSON.stringify(proxyReq.headers));
});

squareProxy.on('proxyRes', function(proxyRes, req, res) {
  //console.log("req in proxyRes: " + JSON.stringify(req.headers));
  //console.log("response to us: " + JSON.stringify(proxyRes.headers));    
});

router.get('/proxy', expressSquareProxy('http://hellogov.squarespace.com', {
  forwardPath: function(req) {
    console.log("forwardPath: " + require('url').parse(req.url).path);
    return '';//require('url').parse(req.url).path;
  }
}));
router.get('/', function(request, response, next) {
    if(request.user){
        response.redirect('/home');
    } else {
        //debugger;
        console.log("trying express proxy");
        //proxyResponse = expressSquareProxy('http://hellogov.squarespace.com');
        //proxyResponse(request, response, next);
        //expressSquareProxy('http://hellogov.squarespace.com');
        squareProxy.web(request, response, {target: secrets.marketing_site_url});
        //response.redirect('/login');
    }
});

router.get('/home', (request, response) => {
    if(request.user){
        influencerPromise = influencerController.findInfluencer(request);
        influencerPromise.then(function(result) {
            console.log("rendering for influencer: " + JSON.stringify(result))
            response.render('home', {influencer: result, logged_in: true});
        });
    } else {
        response.redirect('/login');
    }
});

router.get('/profile', (request, response) => {
    if(request.user){
        influencerPromise = influencerController.findInfluencer(request);
        influencerPromise.then(function(result) {
            console.log("rendering for influencer: " + JSON.stringify(result))
            response.render('profile', {influencer: result, logged_in: true});
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

router.use('/api', apiRoutes);

router.use(function timeLog (request, response, next) {
  console.log(`Couldn't load any page`);
  response.status(404).render('404', {logged_in: request.user != null});
});

module.exports = router;
