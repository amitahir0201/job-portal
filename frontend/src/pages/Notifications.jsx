import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import SeekerHeader from '../components/SeekerHeader';
import NotificationTabs from '../components/NotificationTabs';
import NotificationCard from '../components/NotificationCard';
import { AlertCircle, Loader, Bell, CheckCircle } from 'lucide-react';
import api from '../services/api';

// Demo notifications data
const DUMMY_NOTIFICATIONS = [
  {
    _id: 'notif1',
    type: 'application',
    title: 'Application Received',
    message: 'Your application for Senior React Developer at TechVentures Inc has been received.',
    relatedId: 'app1',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'notif2',
    type: 'interview',
    title: 'Interview Scheduled',
    message: 'You have been scheduled for an interview on Feb 28, 2026 at 2:00 PM.',
    relatedId: 'app2',
    isRead: false,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'notif3',
    type: 'message',
    title: 'New Message',
    message: 'You have a new message from CloudNine Solutions recruiter.',
    relatedId: 'conv1',
    isRead: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'notif4',
    type: 'job',
    title: 'Job Recommendation',
    message: 'A new Full Stack Developer position matches your profile at DesignHub Pro.',
    relatedId: 'job1',
    isRead: false,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'notif5',
    type: 'application',
    title: 'Application Status Updated',
    message: 'Your application for Frontend Engineer has been shortlisted!',
    relatedId: 'app3',
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'notif6',
    type: 'system',
    title: 'Profile Completion',
    message: 'Complete your profile to increase your chances of getting hired.',
    relatedId: null,
    isRead: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'notif7',
    type: 'interview',
    title: 'Interview Reminder',
    message: 'Reminder: Your interview with DataCore Systems is tomorrow at 10:00 AM.',
    relatedId: 'app4',
    isRead: false,
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'notif8',
    type: 'job',
    title: 'Trending Job Posted',
    message: 'Node.js Backend Developer position is trending in your area.',
    relatedId: 'job2',
    isRead: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const Notifications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useDummy, setUseDummy] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/notifications');

      if (response.data.success && Array.isArray(response.data.notifications)) {
        setNotifications(response.data.notifications);
        setUseDummy(false);
      } else {
        setUseDummy(true);
        setNotifications(DUMMY_NOTIFICATIONS);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to fetch notifications');
      setUseDummy(true);
      setNotifications(DUMMY_NOTIFICATIONS);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (activeFilter === 'all') return true;
    return notif.type === activeFilter;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const totalCount = notifications.length;

  const handleMarkAsRead = async (notificationId) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) =>
        n._id === notificationId ? { ...n, isRead: true } : n
      )
    );

    // API call
    try {
      await api.post(`/notifications/${notificationId}/read`);
    } catch (err) {
      console.error('Error marking notification as read:', err);
      // Revert on error
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, isRead: false } : n
        )
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

    try {
      await api.post('/notifications/mark-all-read');
    } catch (err) {
      console.error('Error marking all as read:', err);
      // Revert on error
      fetchNotifications();
    }
  };

  const handleNotificationClick = (notification) => {
    // Mark as read
    handleMarkAsRead(notification._id);

    // Navigate based on type
    if (notification.type === 'application') {
      navigate('/applications');
    } else if (notification.type === 'interview') {
      navigate('/applications');
    } else if (notification.type === 'message') {
      navigate('/messages');
    } else if (notification.type === 'job') {
      navigate(`/job-details/${notification.relatedId}`);
    }
  };

  return (
    <>
      <SeekerHeader />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Notifications</h1>
                <p className="text-gray-600">Stay updated with your job activities</p>
              </div>
              {unreadCount > 0 && (
                <div className="flex items-center gap-3">
                  <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full font-bold text-sm">
                    {unreadCount} Unread
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition flex items-center gap-2"
                    >
                      <CheckCircle size={18} />
                      Mark All as Read
                    </button>
                  )}
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500">
              Total Notifications: <span className="font-bold text-gray-900">{totalCount}</span>
            </p>
          </div>

          {/* Demo Notice */}
          {useDummy && (
            <div className="mb-6 flex items-start gap-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-bold text-blue-900 mb-1">Demo Data</h3>
                <p className="text-blue-700 text-sm mb-3">
                  Showing sample notifications for demonstration. Connect to backend API to load real notifications.
                </p>
                <button
                  onClick={() => {
                    setNotifications(DUMMY_NOTIFICATIONS);
                    setUseDummy(true);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition text-sm"
                >
                  📊 Load Demo Data
                </button>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !useDummy && (
            <div className="mb-6 flex items-start gap-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-red-900 mb-1">Error</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader className="w-8 h-8 text-emerald-600 animate-spin mb-4" />
              <p className="text-gray-600 font-medium">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="inline-block p-3 bg-gray-100 rounded-full mb-4">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No Notifications Yet</h3>
              <p className="text-gray-600 mb-6">You're all caught up! Start applying to jobs to get notifications.</p>
              <a
                href="/jobs"
                className="inline-block px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition"
              >
                Browse Jobs
              </a>
            </div>
          ) : (
            <>
              {/* Filter Tabs */}
              <NotificationTabs
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                notifications={notifications}
              />

              {/* Notifications List */}
              {filteredNotifications.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <p className="text-gray-600">No {activeFilter} notifications</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredNotifications.map((notification) => (
                    <NotificationCard
                      key={notification._id}
                      notification={notification}
                      onClick={() => handleNotificationClick(notification)}
                      onMarkAsRead={() => handleMarkAsRead(notification._id)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Notifications;

