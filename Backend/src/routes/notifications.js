const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const notificationController = require('../controllers/notificationController');

// Standard list for Job Seekers (GET /api/notifications)
router.get('/', authMiddleware, notificationController.listNotifications);

// Specific list for Recruiters (GET /api/notifications/recruiter)
// This line fixes the 404 error you encountered
router.get('/recruiter', authMiddleware, notificationController.getRecruiterNotifications);

// Unread count (GET /api/notifications/unread/count)
router.get('/unread/count', authMiddleware, notificationController.unreadCount);

// Mark single as read (POST /api/notifications/:id/read)
router.post('/:id/read', authMiddleware, notificationController.markAsRead);

// Mark all as read (POST /api/notifications/mark-all-read)
router.post('/mark-all-read', authMiddleware, notificationController.markAllRead);

module.exports = router;