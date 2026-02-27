const Notification = require('../models/Notification');

exports.listNotifications = async (req, res) => {
  const notes = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(200);
  res.json({ success: true, notifications: notes });
};

exports.unreadCount = async (req, res) => {
  const cnt = await Notification.countDocuments({ user: req.user._id, isRead: false });
  res.json({ success: true, unreadCount: cnt });
};

exports.markAsRead = async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.json({ success: true });
};

exports.markAllRead = async (req, res) => {
  await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
  res.json({ success: true });
};