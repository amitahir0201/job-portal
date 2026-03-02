import React, { useEffect, useRef, useState } from 'react';
import { Phone, Info, ArrowLeft, Check, CheckCheck, Loader, MessageCircle } from 'lucide-react';
import MessageBubble from './MessageBubble';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const RecruiterChatWindow = ({
  conversation = null,
  messages = [],
  loading = false,
  sending = false,
  onSendMessage,
  onBackClick,
  currentUserId,
}) => {
  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center px-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <MessageCircle size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Select a Conversation</h3>
          <p className="text-gray-600">Choose a seeker to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white h-full overflow-hidden">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 p-4 shadow-sm">
        <div className="flex items-center gap-4 justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Mobile Back Button */}
            <button
              onClick={onBackClick}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <ArrowLeft size={20} className="text-gray-700" />
            </button>

            {/* Seeker Info */}
            <div className="relative flex-shrink-0">
              <img
                src={
                  conversation.profile?.profilePhoto 
                    ? (conversation.profile.profilePhoto.startsWith('http') 
                        ? conversation.profile.profilePhoto 
                        : `http://localhost:5000${conversation.profile.profilePhoto}`)
                    : `https://ui-avatars.com/api/?name=${conversation.name}&background=10b981&color=fff`
                }
                alt={conversation.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-emerald-100"
              />
              {conversation.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-gray-900 truncate">{conversation.name}</h2>
              <div className="flex items-center gap-2 text-xs">
                {conversation.jobTitle && (
                  <span className="text-gray-600 truncate">{conversation.jobTitle}</span>
                )}
                {conversation.jobTitle && conversation.isOnline && (
                  <span className="text-gray-400">•</span>
                )}
                <span className={`font-medium flex items-center gap-1 ${
                  conversation.isOnline ? 'text-green-600' : 'text-gray-500'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${conversation.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                  {conversation.isOnline ? 'Active' : 'Offline'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-900"
              title="Call"
            >
              <Phone size={18} />
            </button>
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-900"
              title="View profile"
            >
              <Info size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <MessageList
          messages={messages}
          loading={loading}
          userId={currentUserId}
        />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-100 bg-white flex-shrink-0 shadow-md">
        <MessageInput
          onSendMessage={onSendMessage}
          disabled={!conversation}
          isLoading={sending}
          placeholder={`Message ${conversation.name}...`}
        />
      </div>
    </div>
  );
};

export default RecruiterChatWindow;
