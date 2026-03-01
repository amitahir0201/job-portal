const express = require('express');
const router = express.Router();
const path = require('path');
const auth = require('../middleware/authMiddleware');
const asyncHandler = require('../middleware/asyncHandler');
const profileController = require('../controllers/profileController');
const role = require('../middleware/roleMiddleware');
const multer = require('multer');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    // Accept image files only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

router.get('/', auth, asyncHandler(profileController.getProfile));
router.put('/', auth, upload.single('photo'), asyncHandler(profileController.updateProfile));
router.post('/resume', auth, upload.single('resume'), asyncHandler(profileController.uploadResume));
router.post('/upload-photo', auth, upload.single('photo'), asyncHandler(profileController.uploadPhoto));

router.get('/company', auth, role('recruiter'), asyncHandler(profileController.getCompanyProfile));
router.post('/company', auth, role('recruiter'), upload.single('companyLogo'), asyncHandler(profileController.updateCompanyProfile));

module.exports = router;
