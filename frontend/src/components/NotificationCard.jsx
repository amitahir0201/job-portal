import React from 'react';
import { FileText, Calendar, MessageCircle, Briefcase, Bell } from 'lucide-react';

const NotificationCard = ({ notification, onClick, onMarkAsRead }) => {
  const getIcon = () => {
    const iconProps = 'w-5 h-5 flex-shrink-0';

    switch (notification.type) {
      case 'application':
        return <FileText className={`${iconProps} text-blue-600`} />;
      case 'interview':
        return <Calendar className={`${iconProps} text-orange-600`} />;
      case 'message':
        return <MessageCircle className={`${iconProps} text-purple-600`} />;
      case 'job':
        return <Briefcase className={`${iconProps} text-emerald-600`} />;
      case 'system':
        return <Bell className={`${iconProps} text-gray-600`} />;
      default:
        return <Bell className={`${iconProps} text-gray-600`} />;
    }
  };

  const getBackgroundColor = () => {
    if (notification.isRead) {
      return 'bg-white border-gray-200';
    }
    return 'bg-emerald-50 border-emerald-200';
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      onClick={onClick}
      className={`border rounded-xl p-4 transition cursor-pointer hover:shadow-md ${getBackgroundColor()}`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="mt-1">{getIcon()}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-gray-900">{notification.title}</h3>
            {!notification.isRead && (
              <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full flex-shrink-0 mt-1"></span>
            )}
          </div>
          <p className="text-sm text-gray-700 mb-2 line-clamp-2">{notification.message}</p>
          <p className="text-xs text-gray-500">{formatTimeAgo(notification.createdAt)}</p>
        </div>

        {/* Mark as Read Button */}
        {!notification.isRead && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead();
            }}
            className="flex-shrink-0 px-3 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-xs font-bold rounded-full transition"
          >
            Mark Read
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationCard;
