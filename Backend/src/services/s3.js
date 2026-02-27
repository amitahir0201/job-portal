// Simple abstraction: if you configure AWS env vars, you can implement S3 upload here.
// For demo, we return a fake URL or use local storage via multer.
//
// Replace with aws-sdk v3 or @aws-sdk/client-s3 implementation when ready.

const { v4: uuidv4 } = require('uuid');

const uploadFile = async (fileBuffer, originalName) => {
  // TODO: upload to S3 and return URL
  // For now return a placeholder path
  const key = `${Date.now()}-${uuidv4()}-${originalName}`;
  // If you want local, you must have multer configured to save files to /uploads and return that URL.
  return `/uploads/${key}`;
};

module.exports = { uploadFile };