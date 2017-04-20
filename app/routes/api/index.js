const express = require('express');
const router = express.Router();
const adminRoutes = require('./admin');
const campaignRoutes = require('./campaign');
const eventRoutes = require('./event');
const userRoutes = require('./user');
const authRoutes = require('./auth');

router.use('/', adminRoutes);
router.use('/', campaignRoutes);
router.use('/', eventRoutes);
router.use('/', userRoutes);
router.use('/', authRoutes);

module.exports = router;
