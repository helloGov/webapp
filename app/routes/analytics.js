var eventController = require("../middleware/event.js");
module.exports = function (router) {
    router.get('/analytics', (request, response) => {
        response.render('analytics',
        	{callsMade: 100,
        	 pageViews: 200,
        	 });
    });

    router.post('/event', eventController.logEvent);
};
