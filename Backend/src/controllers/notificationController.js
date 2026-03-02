const Notification = require('../models/Notification');
const User = require('../models/User');
const Job = require('../models/Job');

// @desc    Get all notifications for a Seeker (Default list)
// @route   GET /api/notifications
exports.listNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    // --- Dynamic Deadline Check ---
    const user = await User.findById(userId).populate('savedJobs');
    if (user && user.savedJobs && user.savedJobs.length > 0) {
      const now = new Date();
      const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

      for (const job of user.savedJobs) {
        if (job.applicationDeadline && job.applicationDeadline > now && job.applicationDeadline <= threeDaysFromNow) {
          // Check if we already notified about this job deadline recently
          const existingNote = await Notification.findOne({
            user: userId,
            type: 'job',
            relatedId: job._id.toString(),
            title: 'Job Deadline Approaching'
          });

          if (!existingNote) {
            await Notification.create({
              user: userId,
              type: 'job',
              title: 'Job Deadline Approaching',
              message: `The application deadline for your saved job "${job.title}" is on ${job.applicationDeadline.toLocaleDateString()}. Don't forget to apply!`,
              relatedId: job._id.toString()
            });
          }
        }
      }
    }
    // --- End Deadline Check ---

    const notes = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(200);
    res.json({ success: true, notifications: notes });
  } catch (error) {
    console.error("listNotifications error:", error);
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