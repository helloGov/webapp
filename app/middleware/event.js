
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
        console.log("event stored: " + JSON.stringify(result));
    }).catch(function(error){
        console.log(error);
    });
    response.send('OK');
}

module.exports = eventController;
