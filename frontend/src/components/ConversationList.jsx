import React, { useState, useMemo } from 'react';
import { Search, MessageSquare, Loader } from 'lucide-react';
import ConversationItem from './ConversationItem';

const ConversationList = ({ 
  conversations = [], 
  selectedConversationId = null,
  onSelectConversation,
  loading = false,
  isRecruiter = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) {
      return conversations;
    }
    const query = searchQuery.toLowerCase();
    return conversations.filter(
      (conv) =>
        conv.name?.toLowerCase().includes(query) ||
        conv.jobTitle?.toLowerCase().includes(query) ||
        conv.lastMessage?.toLowerCase().includes(query)
    );
  }, [searchQuery, conversations]);

  const unreadCount = conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);

  return (
    <div className="w-full lg:w-96 bg-white border-r border-gray-200 flex flex-col h-screen lg:h-[calc(100vh-70px)] shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 sticky top-0 z-10 bg-white">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare size={24} className="text-emerald-600" />
          <h2 className="text-xl font-bold text-gray-900">Messages</h2>
        </div>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-gray-500 border border-gray-200 transition-all text-sm"
          />
        </div>
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span className="font-medium">
            {filteredConversations.length} {isRecruiter ? 'Seekers' : 'Recruiters'}
          </span>
          {unreadCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
              {unreadCount} Unread
            </span>
          )}
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full py-12 gap-3">
            <Loader size={40} className="text-emerald-600 animate-spin" />
            <p className="text-gray-600 font-medium">Loading conversations...</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center gap-3">
            <MessageSquare size={48} className="text-gray-300 opacity-50" />
            <p className="text-gray-600 font-medium">
              {conversations.length === 0
                ? 'No conversations yet'
                : 'No match found'}
            </p>
            <p className="text-sm text-gray-500">
              {conversations.length === 0
                ? isRecruiter
                  ? 'Conversations with job seekers will appear here'
                  : 'Conversations with recruiters will appear here'
                : 'Try adjusting your search'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id || conversation._id}
                conversation={conversation}
                isSelected={
                  selectedConversationId ===
                  (conversation.id || conversation._id)
                }
                onClick={() => onSelectConversation(conversation)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      {conversations.length > 0 && !loading && (
        <div className="p-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-600 flex items-center justify-between">
          <span>
            {filteredConversations.length} of {conversations.length}
          </span>
          {filteredConversations.length !== conversations.length && (
            <span className="text-gray-500">Showing filtered</span>
          )}
        </div>
      )}
    </div>
  );
};

export default ConversationList;
