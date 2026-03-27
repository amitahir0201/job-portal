const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const asyncHandler = require('../middleware/asyncHandler');

router.get('/:id', asyncHandler(fileController.getFile));

module.exports = router;
