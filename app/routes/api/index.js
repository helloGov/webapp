const express = require('express');
const router = express.Router();
const adminRoutes = require('./admin');
const campaignRoutes = require('./campaign');
const eventRoutes = require('./event');
const influencerRoutes = require('./influencer');

router.use('/', adminRoutes);
router.use('/', campaignRoutes);
router.use('/', eventRoutes);
router.use('/', influencerRoutes);

module.exports = router;
