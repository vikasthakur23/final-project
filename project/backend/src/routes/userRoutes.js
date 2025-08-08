const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

router.get('/me', authMiddleware, userController.getMe);
router.post('/create-admin', authMiddleware, userController.createAdmin); // ideally protected by superadmin

module.exports = router;
