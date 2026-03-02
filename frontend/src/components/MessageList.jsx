import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import { Loader, MessageCircle } from 'lucide-react';

const MessageList = ({ messages = [], loading = false, userId, onMessagesLoad }) => {
  const endRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Group messages by date
  const groupMessagesByDate = (msgs) => {
    const grouped = {};

    msgs.forEach((msg) => {
      const date = new Date(msg.timestamp || msg.createdAt);
      const dateKey = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(msg);
    });

    return grouped;
  };

  const groupedMessages = groupMessagesByDate(messages);
  const dates = Object.keys(groupedMessages);

  // Determine if current user is sender
  const isSender = (message) => {
    const sId = message.senderId?._id || message.senderId || message.sender?._id;
    return String(sId) === String(userId);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 mb-4">
            <Loader size={32} className="text-emerald-600 animate-spin" />
          </div>
          <p className="text-gray-600 font-medium">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center p-6 max-w-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <MessageCircle size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Start a Conversation
          </h3>
          <p className="text-gray-600 text-sm">
            Send a message to get started. They will be notified and can respond to you.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto bg-gradient-to-b from-white via-white to-gray-50 p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
    >
      {/* Messages by Date */}
      {dates.map((date, dateIndex) => (
        <div key={date} className="animate-in fade-in duration-300">
          {/* Date Divider */}
          <div className="flex items-center gap-3 my-6 first:mt-0">
            <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
            <span className="text-xs font-semibold text-gray-500 bg-white px-3 py-1 rounded-full whitespace-nowrap">
              {date === new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                ? 'Today'
                : date === new Date(Date.now() - 86400000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                ? 'Yesterday'
                : date}
            </span>
            <div className="flex-1 h-px bg-gradient-to-l from-gray-200 to-transparent"></div>
          </div>

          {/* Messages for this date */}
          <div className="space-y-2">
            {groupedMessages[date].map((message, index) => (
              <MessageBubble
                key={message._id || message.id || index}
                message={message}
                isSender={isSender(message)}
                showTime={true}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Scroll anchor */}
      <div ref={endRef} className="h-4" />
    </div>
  );
};

export default MessageList;
