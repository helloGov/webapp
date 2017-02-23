var eventController = require("../middleware/event.js");
module.exports = function (router) {
    router.get('/analytics/:campaign_id', eventController.getAnalytics);

    router.post('/event', eventController.logEvent);
};
