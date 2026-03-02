import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import RecruiterLayout from '../layouts/RecruiterLayout';
import SeekerLayout from '../layouts/SeekerLayout';
import ConversationList from '../components/ConversationList';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import { AlertCircle, MessageCircle } from 'lucide-react';
import api from '../services/api';
import { getFullImageUrl } from '../utils/imageUtils';

const Messages = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState(null);
  const [isMobileListView, setIsMobileListView] = useState(true);

  const isRecruiter = user?.role === 'recruiter';
  const Layout = isRecruiter ? RecruiterLayout : SeekerLayout;
  const targetUserId = searchParams.get('user') || searchParams.get('candidate');
  const targetJobId = searchParams.get('job');

  const getConversationKey = (conversation) =>
    conversation?.userId || conversation?.id || conversation?._id;

  // Demo conversations data
  const DEMO_CONVERSATIONS = [
    {
      id: 'conv1',
      name: 'Sarah Johnson',
      profile: { profilePhoto: null },
      jobTitle: 'Senior React Developer',
      lastMessage: 'Thanks for the opportunity! Looking forward to the interview.',
      lastMessageTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      unreadCount: 2,
      isOnline: true,
      userId: 'seeker1',
    },
    {
      id: 'conv2',
      name: 'Mike Chen',
      profile: { profilePhoto: null },
      jobTitle: 'Full Stack Developer',
      lastMessage: 'Could you provide more details about the role?',
      lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      unreadCount: 0,
      isOnline: false,
      userId: 'seeker2',
    },
    {
      id: 'conv3',
      name: 'Emma Wilson',
      profile: { profilePhoto: null },
      jobTitle: 'UI/UX Designer',
      lastMessage: 'I am available for the interview next week.',
      lastMessageTime: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      unreadCount: 0,
      isOnline: true,
      userId: 'seeker3',
    },
  ];

  // Demo messages
  const DEMO_MESSAGES = [
    {
      _id: 'msg1',
      senderId: 'recruiter-id',
      text: 'Hi Sarah! Thanks for applying to our Senior React Developer position.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'read',
    },
    {
      _id: 'msg2',
      senderId: 'seeker1',
      text: 'Hi! Thank you for reaching out. I am very interested in this position.',
      timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
      status: 'read',
    },
    {
      _id: 'msg3',
      senderId: 'recruiter-id',
      text: 'Great! Can you tell me about your experience with React and Next.js?',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      status: 'read',
    },
    {
      _id: 'msg4',
      senderId: 'seeker1',
      text: 'Of course! I have 4+ years of React experience and 2+ years with Next.js. I have built several production applications...',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      status: 'delivered',
    },
  ];

  // Fetch conversations
  useEffect(() => {
    fetchConversations();
  }, [user?.id, targetUserId, targetJobId]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get('/messages/conversations/all/list');

      if (response.data.success) {
        const incomingConversations = response.data.data || [];
        let selected = null;

        if (targetUserId) {
          selected = incomingConversations.find(
            (conv) => getConversationKey(conv) === targetUserId
          );

          if (!selected) {
            selected = {
              id: targetUserId,
              userId: targetUserId,
              jobId: targetJobId || null,
              name: isRecruiter ? 'Candidate' : 'Recruiter',
              profile: { profilePhoto: null },
              lastMessage: '',
              lastMessageTime: null,
              unreadCount: 0,
              isOnline: false,
            };
            incomingConversations.unshift(selected);
          }
        } else if (incomingConversations.length > 0) {
          selected = incomingConversations[0];
        }

        setConversations(incomingConversations);
        setSelectedConversation(selected);

        if (selected) {
          await fetchMessages(getConversationKey(selected));
          setIsMobileListView(false);
        }
      } else {
        throw new Error('Failed to fetch conversations');
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to load conversations');
      // Use demo data as fallback
      setConversations(DEMO_CONVERSATIONS);
      if (DEMO_CONVERSATIONS.length > 0) {
        setSelectedConversation(DEMO_CONVERSATIONS[0]);
        setMessages(DEMO_MESSAGES);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for selected conversation
  const fetchMessages = async (conversationId) => {
    try {
      setLoadingMessages(true);
      setError(null);

      // Backend conversation endpoint expects the other user's id for both recruiter and seeker.
      const response = await api.get(`/messages/conversation/${conversationId}`);
      if (response.data.success) {
        setMessages(response.data.messages || []);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages');
      // Use demo messages as fallback
      setMessages(DEMO_MESSAGES);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Handle conversation selection
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(getConversationKey(conversation));
    setIsMobileListView(false); // Switch to chat view on mobile
  };

  // Handle send message
  const handleSendMessage = async (messageData) => {
    if (!messageData.message.trim() && messageData.attachments.length === 0) return;
    if (!selectedConversation) return;

    try {
      setSendingMessage(true);

      // Optimistic update
      const newMessage = {
        _id: Date.now().toString(),
        senderId: user?.id,
        text: messageData.message,
        timestamp: new Date().toISOString(),
        status: 'pending',
      };

      setMessages((prev) => [...prev, newMessage]);

      // API call
      const receiverId = getConversationKey(selectedConversation);
      if (!receiverId) {
        throw new Error('Unable to identify message receiver');
      }

      const response = await api.post('/messages', {
        receiverId,
        jobId: selectedConversation.jobId,
        message: messageData.message,
        attachments: messageData.attachments,
      });

      if (response.data.success) {
        // Update message with server response
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === newMessage._id
              ? {
                  ...msg,
                  _id: response.data.message._id || response.data.data._id,
                  status: 'sent',
                }
              : msg
          )
        );

        // Update last message in conversation list
        setConversations((prev) =>
          prev.map((conv) =>
            getConversationKey(conv) === getConversationKey(selectedConversation)
              ? {
                  ...conv,
                  lastMessage: messageData.message,
                  lastMessageTime: new Date().toISOString(),
                }
              : conv
          )
        );
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
      // Revert optimistic update
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <Layout>
      <div className="h-full bg-gray-50 flex flex-col lg:flex-row gap-0 overflow-hidden">
        {/* Conversations List */}
        <div className={`${isMobileListView ? 'block' : 'hidden'} lg:block w-full lg:w-96 h-full`}>
          <ConversationList
            conversations={conversations}
            selectedConversationId={selectedConversation?.id || selectedConversation?._id}
            onSelectConversation={handleSelectConversation}
            loading={loading}
            isRecruiter={isRecruiter}
          />
        </div>

        {/* Chat Window */}
        <div className={`${isMobileListView ? 'hidden' : 'flex'} lg:flex flex-1 flex-col bg-white h-full overflow-hidden`}>
          {/* Error Banner */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border-b border-red-200 animate-in slide-in-from-top duration-300">
              <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-700 font-bold text-lg leading-none transition-colors"
              >
                ✕
              </button>
            </div>
          )}

          {/* Chat Area */}
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-100 sticky top-0 z-10 p-4 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => setIsMobileListView(true)}
                      className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                      title="Back to conversations"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <div className="relative flex-shrink-0">
                      <img
                        src={getFullImageUrl(selectedConversation.profile?.profilePhoto) || `https://ui-avatars.com/api/?name=${selectedConversation.name}&background=10b981&color=fff`}
                        alt={selectedConversation.name}
                        className="w-11 h-11 rounded-full object-cover border-2 border-emerald-100"
                      />
                      {selectedConversation.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-bold text-gray-900 truncate">
                        {selectedConversation.name}
                      </h2>
                      <div className="flex items-center gap-2">
                        <span className={`inline-block w-2 h-2 rounded-full ${selectedConversation.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        <p className="text-xs text-gray-600 truncate">
                          {selectedConversation.isOnline ? 'Active now' : 'Offline'}
                        </p>
                        {selectedConversation.jobTitle && (
                          <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            {selectedConversation.jobTitle}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 hidden sm:block">
                    {isRecruiter ? 'Recruiter Inbox' : 'Job Seeker Inbox'}
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-hidden">
                <MessageList
                  messages={messages}
                  loading={loadingMessages}
                  userId={user?.id}
                />
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-100 bg-white p-2 sm:p-4 flex-shrink-0 shadow-md">
                <MessageInput
                  onSendMessage={handleSendMessage}
                  disabled={!selectedConversation}
                  isLoading={sendingMessage}
                  placeholder={`Message ${selectedConversation.name}...`}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="text-center px-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
                  <MessageCircle size={32} className="text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {conversations.length === 0 ? 'No Conversations Yet' : 'Select a Conversation'}
                </h3>
                <p className="text-gray-600 max-w-xs">
                  {conversations.length === 0
                    ? isRecruiter
                      ? 'Conversations with job seekers will appear here when they message you'
                      : 'Conversations with recruiters will appear here when you start messaging'
                    : 'Choose a conversation from the list to start messaging'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
