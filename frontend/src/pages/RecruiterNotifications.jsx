import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import RecruiterHeader from '../components/RecruiterHeader';
import NotificationTabs from '../components/NotificationTabs';
import NotificationCard from '../components/NotificationCard';
import { AlertCircle, Loader, Bell, CheckCircle } from 'lucide-react';
import api from '../services/api';

const DUMMY_RECRUITER_NOTIFICATIONS = [
  {
    _id: 'r_notif1',
    type: 'application',
    title: 'New Application',
    message: 'John Doe applied for Senior Backend Engineer.',
    relatedId: 'app_101',
    isRead: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'r_notif2',
    type: 'interview',
    title: 'Interview Accepted',
    message: 'Sarah Smith confirmed the interview for Friday.',
    relatedId: 'app_102',
    isRead: false,
    createdAt: new Date().toISOString(),
  }
];

const RecruiterNotifications = () => {
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
      const response = await api.get('/notifications/recruiter');
      if (response.data && Array.isArray(response.data.notifications)) {
        setNotifications(response.data.notifications);
        setUseDummy(false);
      } else {
        setNotifications(DUMMY_RECRUITER_NOTIFICATIONS);
        setUseDummy(true);
      }
    } catch (err) {
      setNotifications(DUMMY_RECRUITER_NOTIFICATIONS);
      setUseDummy(true);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    try { await api.post(`/notifications/${id}/read`); } catch (e) {}
  };

  const handleMarkAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    try { await api.post('/notifications/mark-all-read'); } catch (e) {}
  };

  const filtered = notifications.filter(n => activeFilter === 'all' || n.type === activeFilter);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <>
      <RecruiterHeader />
      <div className="min-h-screen bg-slate-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Recruiter Inbox</h1>
              <p className="text-slate-600">Manage candidate updates</p>
            </div>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllAsRead}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 text-sm font-bold"
                >
                  <CheckCircle size={16} /> Mark All Read
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader className="animate-spin text-blue-600" /></div>
          ) : notifications.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-xl border">
              <Bell className="mx-auto mb-4 text-slate-300" size={48} />
              <p>No notifications yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <NotificationTabs 
                activeFilter={activeFilter} 
                setActiveFilter={setActiveFilter} 
                notifications={notifications} 
              />
              {filtered.map(n => (
                <NotificationCard 
                  key={n._id} 
                  notification={n} 
                  onClick={() => navigate(`/recruiter/applications/${n.relatedId}`)}
                  onMarkAsRead={() => handleMarkAsRead(n._id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RecruiterNotifications;