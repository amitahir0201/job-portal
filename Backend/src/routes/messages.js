const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const messageController = require('../controllers/messageController');

// conversation list
router.get('/conversations/all/list', authMiddleware, messageController.listConversations);

// conversation messages
router.get('/conversation/:id', authMiddleware, messageController.getConversationMessages);

// messages by job (for job-specific threads)
router.get('/job/:jobId', authMiddleware, messageController.getMessagesByJob);

// send message
router.post('/', authMiddleware, messageController.sendMessage);

// mark read for job
router.post('/mark-read/job/:jobId', authMiddleware, messageController.markReadByJob);

module.exports = router;
