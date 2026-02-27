const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const appController = require('../controllers/applicationController');

// POST /api/applications/apply
router.post('/apply', authMiddleware, appController.apply);

// GET /api/applications/job/:jobId
router.get('/job/:jobId', authMiddleware, appController.listByJob);

// GET /api/applications/my
router.get('/my', authMiddleware, appController.listMyApplications);

// GET /api/applications/:id
router.get('/:id', authMiddleware, appController.getApplication);

// PUT /api/applications/:id/status
router.put('/:id/status', authMiddleware, appController.updateStatus);

// PATCH /api/applications/:id/schedule-interview
router.patch('/:id/schedule-interview', authMiddleware, appController.scheduleInterview);

// PATCH /api/applications/:id/reject
router.patch('/:id/reject', authMiddleware, appController.rejectApplication);

// POST /api/applications/:id/withdraw
router.post('/:id/withdraw', authMiddleware, appController.withdraw);

module.exports = router;
