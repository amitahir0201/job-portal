const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const asyncHandler = require('../middleware/asyncHandler');

router.post('/register', asyncHandler(authController.register));
router.post('/login', asyncHandler(authController.login));
router.get('/profile', asyncHandler(authController.getProfile)); // requires token - controller will check
router.get('/me', asyncHandler(authController.getProfile));

module.exports = router;