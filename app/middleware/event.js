
var mongoose = require("mongoose"),
    Event = mongoose.model('Event'),
    getIP = require('ipware')().get_ip;

var eventController = {};

eventController.logEvent = function (request, response) {
    event = new Event({
        type: request.body.type,
        ip: getIP(request).clientIp,
        metadata: {
            campaign: request.body.campaign
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
