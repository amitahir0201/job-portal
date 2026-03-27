const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId: String, // optional string identifier
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  attachments: [{ name: String, url: String, type: String, size: Number }],
  status: { type: String, enum: ['pending', 'sent', 'delivered', 'read'], default: 'sent' },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);