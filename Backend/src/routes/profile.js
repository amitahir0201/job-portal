const express = require('express');
const router = express.Router();
const path = require('path');
const auth = require('../middleware/authMiddleware');
const asyncHandler = require('../middleware/asyncHandler');
const profileController = require('../controllers/profileController');
const role = require('../middleware/roleMiddleware');
const multer = require('multer');
const fs = require('fs');

const upload = require('../config/gridfs');

router.get('/', auth, asyncHandler(profileController.getProfile));
router.put('/', auth, upload.single('photo'), asyncHandler(profileController.updateProfile));
router.post('/resume', auth, upload.single('resume'), asyncHandler(profileController.uploadResume));
router.post('/upload-photo', auth, upload.single('photo'), asyncHandler(profileController.uploadPhoto));


router.get('/company', auth, role('recruiter'), asyncHandler(profileController.getCompanyProfile));
router.post('/company', auth, role('recruiter'), upload.single('companyLogo'), asyncHandler(profileController.updateCompanyProfile));

module.exports = router;
