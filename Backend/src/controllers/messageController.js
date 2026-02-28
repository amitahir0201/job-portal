const Message = require('../models/Message');
const User = require('../models/User');

// ✅ Send Message
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, jobId, message, attachments } = req.body;

    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!receiverId || (!message && !attachments?.length)) {
      return res.status(400).json({ success: false, message: 'Invalid message' });
    }

    const msg = await Message.create({
      senderId: req.user._id,
      receiverId,
      jobId,
      text: message,
      attachments: attachments || [],
      status: 'sent'
    });

    res.status(201).json({ success: true, message: msg });

  } catch (error) {
    console.error("sendMessage error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ List Conversations
exports.listConversations = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const userId = req.user._id;

    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    })
      .sort({ createdAt: -1 })
      .limit(200)
      .populate('senderId', 'fullName profilePhoto')
      .populate('receiverId', 'fullName profilePhoto');

    const map = new Map();

    for (const m of messages) {
      if (!m.senderId || !m.receiverId) continue;

      const counterpart =
        m.senderId._id.toString() === userId.toString()
          ? m.receiverId
          : m.senderId;

      if (!counterpart) continue;

      const key = counterpart._id.toString();

      if (!map.has(key)) {
        map.set(key, {
          id: key,
          name: counterpart.fullName || counterpart.name || 'User',
          profile: { profilePhoto: counterpart.profilePhoto || null },
          jobTitle: m.jobId?.title || '',
          lastMessage: m.text || '',
          lastMessageTime: m.createdAt,
          unreadCount: 0,
          isOnline: false,
          userId: key,
        });
      }
    }

    res.json({ success: true, data: Array.from(map.values()) });

  } catch (error) {
    console.error("listConversations error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ Get Conversation Messages
exports.getConversationMessages = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const userId = req.user._id.toString();
    const otherId = req.params.id;

    const msgs = await Message.find({
      $or: [
        { senderId: userId, receiverId: otherId },
        { senderId: otherId, receiverId: userId },
      ]
    }).sort({ createdAt: 1 });

    res.json({ success: true, messages: msgs });

  } catch (error) {
    console.error("getConversationMessages error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ Get Messages By Job
exports.getMessagesByJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const msgs = await Message.find({ jobId }).sort({ createdAt: 1 });

    res.json({ success: true, messages: msgs });

  } catch (error) {
    console.error("getMessagesByJob error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ Mark Read By Job
exports.markReadByJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    await Message.updateMany(
      { jobId, receiverId: req.user._id },
      { $set: { status: 'read' } }
    );

    res.json({ success: true });

  } catch (error) {
    console.error("markReadByJob error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};