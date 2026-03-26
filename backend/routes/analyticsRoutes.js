const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { adminAuth } = require('../middleware/auth');

router.get('/dashboard', adminAuth, analyticsController.getDashboardStats);
router.get('/hourly', adminAuth, analyticsController.getHourlyDistribution);
router.get('/weekly', adminAuth, analyticsController.getWeeklyTrends);
router.get('/branches', adminAuth, analyticsController.getBranchStats);
router.get('/peak-hours', adminAuth, analyticsController.getPeakHourAnalysis);

module.exports = router;
