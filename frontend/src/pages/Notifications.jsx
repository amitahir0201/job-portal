import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import SeekerHeader from '../components/SeekerHeader';
import NotificationTabs from '../components/NotificationTabs';
import NotificationCard from '../components/NotificationCard';
import { AlertCircle, Loader, Bell, CheckCircle, Briefcase } from 'lucide-react';
import api from '../services/api';

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
    setNotifications((prev) =>
      prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
    );
    try {
      await api.post(`/notifications/${notificationId}/read`);
    } catch (err) {
      fetchNotifications();
    }
  };

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await api.post('/notifications/mark-all-read');
    } catch (err) {
      fetchNotifications();
    }
  };

  const handleNotificationClick = (notification) => {
    handleMarkAsRead(notification._id);
    if (notification.type === 'application' || notification.type === 'interview') navigate('/applications');
    else if (notification.type === 'message') navigate('/messages');
    else if (notification.type === 'job') navigate(`/job-details/${notification.relatedId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <SeekerHeader />
      
      <main className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-10">
        {/* Header Section: Corrected for overflow */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 truncate">
                Notifications
              </h1>
              <p className="text-sm sm:text-base text-gray-500 mt-1">
                Stay updated with your job activities
              </p>
            </div>

            {unreadCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-bold text-xs sm:text-sm">
                  {unreadCount} Unread
                </span>
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs sm:text-sm font-bold transition-all shadow-sm active:scale-95"
                >
                  <CheckCircle size={16} />
                  <span className="whitespace-nowrap">Mark All Read</span>
                </button>
              </div>
            )}
          </div>
          
          <div className="mt-4 flex items-center gap-2">
            <div className="h-px flex-1 bg-gray-200"></div>
            <span className="text-[10px] sm:text-xs font-semibold uppercase text-gray-400 tracking-wider whitespace-nowrap">
              Total: {totalCount}
            </span>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>
        </div>

        {/* Alerts Container */}
        <div className="space-y-3 mb-6">
          {useDummy && (
            <div className="flex items-start gap-3 p-3 sm:p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div className="min-w-0">
                <h3 className="font-bold text-blue-900 text-sm">Demo Mode</h3>
                <p className="text-blue-700 text-xs mt-0.5 leading-relaxed">
                  Showing sample notifications. Connect your API for real-time updates.
                </p>
              </div>
            </div>
          )}

          {error && !useDummy && (
            <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700 text-xs sm:text-sm font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="w-full">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <Loader className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
              <p className="text-gray-500 text-sm font-medium">Syncing notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No Notifications Yet</h3>
              <p className="text-gray-500 text-sm mt-2 mb-6 max-w-[250px] mx-auto">
                Once you start applying or receiving messages, they will appear here.
              </p>
              <button
                onClick={() => navigate('/jobs')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition text-sm"
              >
                <Briefcase size={16} />
                Explore Jobs
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Tab Navigation Wrapper */}
              <div className="w-full overflow-hidden">
                <NotificationTabs
                  activeFilter={activeFilter}
                  setActiveFilter={setActiveFilter}
                  notifications={notifications}
                />
              </div>

              {/* List Container */}
              <div className="space-y-3 pb-10">
                {filteredNotifications.length === 0 ? (
                  <div className="bg-white rounded-xl border border-dashed border-gray-200 p-10 text-center">
                    <p className="text-gray-400 text-sm italic">
                      No {activeFilter} updates found
                    </p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <NotificationCard
                      key={notification._id}
                      notification={notification}
                      onClick={() => handleNotificationClick(notification)}
                      onMarkAsRead={() => handleMarkAsRead(notification._id)}
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Notifications;