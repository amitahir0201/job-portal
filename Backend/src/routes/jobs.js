const express = require('express');
const router = express.Router();
const jobsController = require('../controllers/jobController');
const asyncHandler = require('../middleware/asyncHandler');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// Public
router.get('/', asyncHandler(jobsController.listJobs));

// Protected recruiter routes
router.post('/', auth, role('recruiter'), asyncHandler(jobsController.createJob));
router.get('/my', auth, role('recruiter'), asyncHandler(jobsController.myJobs));
router.get('/saved', auth, asyncHandler(jobsController.getSavedJobs));
router.put('/:id/status', auth, role('recruiter'), asyncHandler(jobsController.updateJobStatus));
router.get('/:id', asyncHandler(jobsController.getJob));
router.delete('/:id', auth, role('recruiter'), asyncHandler(jobsController.deleteJob));
router.post('/:id/save', auth, asyncHandler(jobsController.saveJob));
router.post('/:id/unsave', auth, asyncHandler(jobsController.unsaveJob));

module.exports = router;
