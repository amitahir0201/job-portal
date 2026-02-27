const Message = require('../models/Message');
const User = require('../models/User');

exports.sendMessage = async (req, res) => {
  const { receiverId, jobId, message, attachments } = req.body;
  if (!receiverId || (!message && !attachments?.length)) return res.status(400).json({ success: false, message: 'Invalid message' });

  const msg = await Message.create({
    senderId: req.user._id,
    receiverId,
    jobId,
    text: message,
    attachments: attachments || [],
    status: 'sent'
  });

  res.json({ success: true, message: msg });
};

exports.listConversations = async (req, res) => {
  // Simple grouping: return last message grouped by receiver/sender pair.
  // For demo, returning distinct counterparts where user participated.
  const userId = req.user._id;
  const messages = await Message.find({
    $or: [{ senderId: userId }, { receiverId: userId }]
  }).sort({ createdAt: -1 }).limit(200).populate('senderId', 'fullName profilePhoto').populate('receiverId', 'fullName profilePhoto');

  // Build conversation summary by counterpart
  const map = new Map();
  for (const m of messages) {
    const counterpart = m.senderId._id.equals(userId) ? m.receiverId : m.senderId;
    const key = counterpart._id.toString();
    if (!map.has(key)) {
      map.set(key, {
        id: key,
        name: counterpart.fullName || counterpart.name || 'User',
        profile: { profilePhoto: counterpart.profilePhoto },
        jobTitle: m.jobId ? (m.jobId.title || '') : '',
        lastMessage: m.text,
        lastMessageTime: m.createdAt,
        unreadCount: 0,
        isOnline: false,
        userId: key,
      });
    }
  }
  res.json({ success: true, data: Array.from(map.values()) });
};

exports.getConversationMessages = async (req, res) => {
  const convId = req.params.id;
  // For simplicity, treat convId as other user's id
  const userId = req.user._id.toString();
  const otherId = convId;
  const msgs = await Message.find({
    $or: [
      { senderId: userId, receiverId: otherId },
      { senderId: otherId, receiverId: userId },
    ]
  }).sort({ createdAt: 1 });
  res.json({ success: true, messages: msgs });
};

exports.getMessagesByJob = async (req, res) => {
  const jobId = req.params.jobId;
  const msgs = await Message.find({ jobId }).sort({ createdAt: 1 });
  res.json({ success: true, messages: msgs });
};

exports.markReadByJob = async (req, res) => {
  const jobId = req.params.jobId;
  await Message.updateMany({ jobId, receiverId: req.user._id }, { $set: { status: 'read' } });
  res.json({ success: true });
};
