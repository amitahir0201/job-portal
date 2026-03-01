const Notification = require('../models/Notification');

// @desc    Get all notifications for a Seeker (Default list)
// @route   GET /api/notifications
exports.listNotifications = async (req, res) => {
  try {
    const notes = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(200);
    res.json({ success: true, notifications: notes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all notifications for a Recruiter
// @route   GET /api/notifications/recruiter
// Note: This matches the frontend call that gave the 404
exports.getRecruiterNotifications = async (req, res) => {
  try {
    // In many systems, 'user' and 'recipient' are the same field. 
    // We use req.user._id to ensure the recruiter only sees their own alerts.
    const notes = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(200);
      
    res.json({ success: true, notifications: notes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get unread count
// @route   GET /api/notifications/unread-count
exports.unreadCount = async (req, res) => {
  try {
    const cnt = await Notification.countDocuments({ user: req.user._id, isRead: false });
    res.json({ success: true, unreadCount: cnt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark single notification as read
// @route   POST /api/notifications/:id/read
exports.markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark all notifications as read
// @route   POST /api/notifications/mark-all-read
exports.markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false }, 
      { isRead: true }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};