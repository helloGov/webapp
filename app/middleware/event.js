
var mongoose = require("mongoose"),
    Event = mongoose.model('Event'),
    getIP = require('ipware')().get_ip,
    uaParser = require('ua-parser');

var eventController = {};

eventController.logEvent = function (request, response) {
    parsedRequest = uaParser.parse(request.headers['user-agent']);
    event = new Event({
        type: request.body.type,
        ip: getIP(request).clientIp,
        metadata: {
            campaign: request.body.campaign
        },
        user_agent: {
            mobile: parsedRequest.isMobile, 
            browser: {
                name: parsedRequest.ua.family,
                version: parsedRequest.ua.toVersionString()
            },
            os: {
                name: parsedRequest.os.family,
                version: parsedRequest.os.toVersionString()
            },
            device: parsedRequest.device.family
        }
    });
    if (request.user) event.user = request.user.id;
    event.save().then( function(result){
    }).catch(function(error){
        console.log(error);
    });
    response.send('OK');
}

eventController.getAnalytics = function(request, response){
    Event.aggregate([
        {$match:
            {"metadata.campaign":request.params.campaign_id}
        },
        {$group:
            {_id:"$type", count: {$sum:1} }
        }
        ], function(error, result){
                if (error) console.log(error);
                analyticsObject = {};
                result.map(function(element) {
                    analyticsObject[element._id] = element.count;
                });
                response.render('analytics', analyticsObject);
        });
}

module.exports = eventController;
