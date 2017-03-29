const express = require('express');
const router = express.Router();
var eventController = require('../../controllers/event.js');

router.route('/events')

.post(eventController.logEvent)

.get(eventController.getAnalytics);

module.exports = router;
