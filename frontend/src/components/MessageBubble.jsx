import React from 'react';
import { Check, CheckCheck, Clock, File, Download } from 'lucide-react';

const MessageBubble = ({ message, isSender, showTime = true }) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={13} className="text-gray-400" />;
      case 'sent':
        return <Check size={13} className="text-gray-400" />;
      case 'delivered':
        return <CheckCheck size={13} className="text-gray-400" />;
      case 'read':
        return <CheckCheck size={13} className="text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-4 gap-2 px-4 animate-in fade-in slide-in-from-bottom-2 duration-200`}
    >
      {!isSender && (
        <div className="flex-shrink-0 mt-1">
          <img
            src={
              message.senderId?.profilePhoto 
                ? (message.senderId.profilePhoto.startsWith('http') 
                    ? message.senderId.profilePhoto 
                    : `http://localhost:5000${message.senderId.profilePhoto}`)
                : `https://ui-avatars.com/api/?name=${message.senderId?.fullName || message.senderName || 'User'}&background=10b981&color=fff&size=32`
            }
            alt="avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
      )}

      <div
        className={`flex flex-col ${isSender ? 'items-end' : 'items-start'} max-w-xs lg:max-w-md`}
      >
        {/* Message Bubble */}
        <div
          className={`px-4 py-3 rounded-2xl shadow-sm transition-all hover:shadow-md ${
            isSender
              ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-br-none'
              : 'bg-gray-100 text-gray-900 rounded-bl-none'
          }`}
        >
          {/* Text */}
          <p className={`text-sm leading-relaxed break-words whitespace-pre-wrap`}>
            {message.text || message.message || ''}
          </p>

          {/* Image Attachment Preview */}
          {message.attachment?.type?.startsWith('image/') && (
            <img
              src={message.attachment.url}
              alt="Attachment"
              className="mt-2 rounded-lg max-w-xs h-auto max-h-72 object-cover border border-white/20"
            />
          )}

          {/* File Attachment Preview */}
          {message.attachment?.type && !message.attachment.type.startsWith('image/') && (
            <div className={`mt-2 flex items-center gap-2 p-2 rounded-lg ${
              isSender ? 'bg-white/20' : 'bg-gray-200'
            }`}>
              <File size={16} className="flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium truncate">
                  {message.attachment.name}
                </p>
                <p className={`text-xs ${isSender ? 'text-white/70' : 'text-gray-600'}`}>
                  {(message.attachment.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <Download size={14} className="flex-shrink-0 opacity-60" />
            </div>
          )}
        </div>

        {/* Time and Status */}
        <div className={`flex items-center gap-1.5 mt-1.5 text-xs text-gray-500`}>
          <span>{formatTime(message.timestamp || message.createdAt)}</span>
          {isSender && getStatusIcon(message.status || 'sent')}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
