import React, { useState } from 'react';
import { MessageCircle, Search, MoreVertical } from 'lucide-react';

const ConversationItem = ({ 
  conversation, 
  isSelected, 
  isLoading,
  onClick 
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'U';
  };

  const formatLastMessageTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const truncateMessage = (text, length = 50) => {
    return text?.length > length ? text.substring(0, length) + '...' : text;
  };

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`w-full p-4 border-b border-gray-100 transition-all duration-200 hover:bg-emerald-50 group relative text-left ${
        isSelected ? 'bg-emerald-50 border-l-4 border-l-emerald-600 shadow-sm' : ''
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <div className="flex gap-3">
        {/* Avatar with Status */}
        <div className="relative flex-shrink-0">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all ${
              isSelected ? 'bg-gradient-to-br from-emerald-600 to-teal-600 ring-2 ring-emerald-600' : 
              'bg-gradient-to-br from-emerald-500 to-teal-500'
            }`}
          >
            {getInitials(conversation.name)}
          </div>
          {conversation.isOnline && (
            <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-md"></div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Name and Time */}
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <h3 className={`font-semibold transition-all ${
              isSelected ? 'text-emerald-900' : 'text-gray-900'
            } truncate`}>
              {conversation.name}
            </h3>
            <span className={`text-xs flex-shrink-0 ${
              isSelected ? 'text-emerald-600 font-medium' : 'text-gray-500'
            }`}>
              {formatLastMessageTime(conversation.lastMessageTime)}
            </span>
          </div>

          {/* Job Title */}
          {conversation.jobTitle && (
            <p className="text-xs text-gray-500 truncate mb-1">
              {conversation.jobTitle}
            </p>
          )}

          {/* Last Message and Unread Count */}
          <div className="flex items-end justify-between gap-2">
            <p className={`text-sm truncate transition-all ${
              conversation.unreadCount > 0 
                ? 'font-semibold text-gray-900' 
                : 'text-gray-600'
            }`}>
              {conversation.lastMessage ? truncateMessage(conversation.lastMessage) : 'No messages yet'}
            </p>
            {conversation.unreadCount > 0 && (
              <span className="flex-shrink-0 inline-flex items-center justify-center min-w-5 h-5 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-md animate-pulse">
                {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Hover Action Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        className="absolute right-3 top-4 p-2 opacity-0 group-hover:opacity-100 hover:bg-white rounded-lg transition-all"
      >
        <MoreVertical size={16} className="text-gray-400" />
      </button>
    </button>
  );
};

export default ConversationItem;
