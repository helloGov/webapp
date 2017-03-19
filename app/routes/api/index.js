const express = require('express');
const router = express.Router();
const adminRoutes = require('./admin');
const campaignRoutes = require('./campaign');
const eventRoutes = require('./event');

router.use('/', adminRoutes);
router.use('/', campaignRoutes);
router.use('/', eventRoutes);

module.exports = router;
