var eventController = require("../middleware/event.js");

module.exports = function (router) {

    router.get('/analytics/:campaign_id', function(request, response){
    	response.render('analytics');
    })

    router.get('/api/analytics/:campaign_id', eventController.getAnalytics);

};
