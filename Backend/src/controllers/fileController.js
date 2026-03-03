const mongoose = require('mongoose');

// GET /api/files/:id
exports.getFile = async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'fs'
    });

    const downloadStream = bucket.openDownloadStream(fileId);

    downloadStream.on('data', (chunk) => {
      res.write(chunk);
    });

    downloadStream.on('error', (err) => {
      console.error('GridFS Error:', err);
      res.status(404).json({ success: false, message: 'File not found' });
    });

    downloadStream.on('end', () => {
      res.end();
    });
  } catch (err) {
    console.error('File retrieval error:', err);
    res.status(400).json({ success: false, message: 'Invalid file ID' });
  }
};
