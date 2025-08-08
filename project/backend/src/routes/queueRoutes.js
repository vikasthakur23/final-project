const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');
const queueController = require('../controllers/queueController');

// public: get queue
router.get('/:venueId', queueController.getQueueByVenue);

// protected: issue token
router.post('/:venueId/issue', authMiddleware, queueController.issueToken);

// admin actions
router.post('/:venueId/call-next', authMiddleware, requireRole('admin'), queueController.callNext);
router.post('/:venueId/cancel/:number', authMiddleware, requireRole('admin'), queueController.cancelToken);

// create a queue (admin)
router.post('/create', authMiddleware, requireRole('admin'), queueController.createQueue);

module.exports = router;
