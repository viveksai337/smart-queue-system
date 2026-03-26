const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queueController');
const { auth, adminAuth } = require('../middleware/auth');

// User routes
router.post('/book', auth, queueController.bookToken);
router.get('/my-tokens', auth, queueController.getMyTokens);
router.put('/cancel/:id', auth, queueController.cancelToken);
router.get('/qr/:code', queueController.getTokenByQR);
router.get('/purposes/:branchId', auth, queueController.getPurposes);

// Public routes
router.get('/live/:branch_id', queueController.getLiveQueue);

// Admin routes
router.post('/call-next', adminAuth, queueController.callNext);
router.put('/complete/:id', adminAuth, queueController.completeToken);
router.put('/skip/:id', adminAuth, queueController.skipToken);

module.exports = router;
