var Event = require('../models/event');
var getIP = require('ipware')().get_ip;
var uaParser = require('ua-parser');

var eventController = {};

eventController.eventTypes = ['call', 'visit'];

eventController.logEvent = function(request, response) {
    var parsedRequest = uaParser.parse(request.headers['user-agent']);
    var event = new Event({
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
    event.save().then(function() {
    }).catch(function(error) {
        console.log(error);
    });
    response.send('OK');
};

eventController.validateAnalytics = function(analyticsObject) {
    eventController.eventTypes.forEach(function(eventType) {
        if (!analyticsObject[eventType]) {
            analyticsObject[eventType] = 0;
        }
    });
    return analyticsObject;
};

eventController.createJsonObject = function(dbResult) {
    var analyticsObject = {};
    dbResult.map(function(element) {
        analyticsObject[element._id] = element.count;
    });
    return analyticsObject;
};

eventController.getAnalytics = function(request, response) {
    Event.aggregate([
        {$match:
            {'metadata.campaign': request.params.campaignId}
        },
        {$group:
            {_id: '$type', count: {$sum: 1}}
        }
    ], function(error, result) {
        if (error) {
            console.log(error);
            response.render('error');
        } else {
            var analyticsObject = eventController.createJsonObject(result);
            analyticsObject = eventController.validateAnalytics(analyticsObject);
            response.send(analyticsObject);
            // response.render('analytics', analyticsObject);
        }
    });
};

module.exports = eventController;
