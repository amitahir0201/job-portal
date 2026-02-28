const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const asyncHandler = require('../middleware/asyncHandler');
const auth = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

/**
 * Admin-only routes
 * All routes require:
 * 1. JWT authentication (auth)
 * 2. Admin role (authorize('admin'))
 */

// POST /api/admin/create-recruiter
// Create a new recruiter account (admin only)
router.post(
  '/create-recruiter',
  asyncHandler(auth),
  asyncHandler(authorize('admin')),
  asyncHandler(adminController.createRecruiter)
);

// GET /api/admin/recruiters
// List all recruiters (admin only)
router.get(
  '/recruiters',
  asyncHandler(auth),
  asyncHandler(authorize('admin')),
  asyncHandler(adminController.listRecruiters)
);

// GET /api/admin/dashboard-stats
// Get dashboard statistics (admin only)
router.get(
  '/dashboard-stats',
  asyncHandler(auth),
  asyncHandler(authorize('admin')),
  asyncHandler(adminController.getDashboardStats)
);

// DELETE /api/admin/recruiters/:recruiterId
// Delete a recruiter account (admin only)
router.delete(
  '/recruiters/:recruiterId',
  asyncHandler(auth),
  asyncHandler(authorize('admin')),
  asyncHandler(adminController.deleteRecruiter)
);

module.exports = router;
