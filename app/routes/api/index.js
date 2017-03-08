const express = require('express');
const router = express.Router();
const campaignRoutes = require('./campaign');
const eventRoutes = require('./event');

router.use('/', campaignRoutes);
router.use('/', eventRoutes);

module.exports = router;
