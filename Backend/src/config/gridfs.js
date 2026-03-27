require('dotenv').config();

const mongoose = require('mongoose');
const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require('multer');
const path = require('path');

// ✅ Use existing mongoose connection instead of URL
const storage = new GridFsStorage({
  db: mongoose.connection,   // 🔥 THIS FIXES YOUR ISSUE
  file: (req, file) => {
    return {
      filename:
        Date.now() +
        '-' +
        Math.random().toString(36).substring(2, 9) +
        path.extname(file.originalname),
      bucketName: 'uploads',
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
