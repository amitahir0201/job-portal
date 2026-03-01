const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/authMiddleware');

const appController = require('../controllers/applicationController');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads/resumes');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for resume uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Only accept PDF files
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// POST /api/applications/apply
router.post('/apply', authMiddleware, upload.single('resume'), appController.apply);

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
