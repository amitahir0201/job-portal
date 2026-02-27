const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const notificationController = require('../controllers/notificationController');

router.get('/', authMiddleware, notificationController.listNotifications);
router.get('/unread/count', authMiddleware, notificationController.unreadCount);
router.post('/:id/read', authMiddleware, notificationController.markAsRead);
router.post('/mark-all-read', authMiddleware, notificationController.markAllRead);

module.exports = router;
