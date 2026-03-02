import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SeekerHeader from '../components/SeekerHeader';
import ChatHeader from '../components/ChatHeader';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import { AlertCircle, Loader } from 'lucide-react';
import api from '../services/api';

const JobSeekerMessages = () => {
  const { jobId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  // State Management
  const [job, setJob] = useState(null);
  const [recruiter, setRecruiter] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(true);

  // Demo data fallback
  const DEMO_MESSAGES = [
    {
      _id: 'msg1',
      senderId: 'recruiter-id',
      receiver: user?.id,
      text: 'Hi! Thanks for applying to our Senior React Developer position. I was impressed with your portfolio.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'read',
    },
    {
      _id: 'msg2',
      senderId: user?.id,
      receiver: 'recruiter-id',
      text: 'Thank you! I am really excited about this opportunity. The job description aligns perfectly with my experience.',
      timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
      status: 'delivered',
    },
    {
      _id: 'msg3',
      senderId: 'recruiter-id',
      receiver: user?.id,
      text: 'Great! Could you tell us about your experience with TypeScript and Next.js?',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      status: 'read',
    },
    {
      _id: 'msg4',
      senderId: user?.id,
      receiver: 'recruiter-id',
      text: 'Of course! I have 3+ years of experience with TypeScript and 2+ years with Next.js. I have successfully built several production applications...',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      status: 'delivered',
    },
  ];

  // Fetch job details and recruiter info
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch job details
        const jobResponse = await api.get(`/jobs/${jobId}`);
        if (jobResponse.data.success) {
          const jobData = jobResponse.data.job || jobResponse.data.data;
          setJob(jobData);

          // Get recruiter info from job
          if (jobData.recruiterId) {
            const recruiterPhotoUrl = jobData.recruiterPhoto
              ? (jobData.recruiterPhoto.startsWith('http')
                  ? jobData.recruiterPhoto
                  : `http://localhost:5000${jobData.recruiterPhoto}`)
              : `https://ui-avatars.com/api/?name=${jobData.companyName || 'Recruiter'}&background=10b981&color=fff`;

            setRecruiter({
              name: jobData.companyName || 'Recruiter',
              profilePhoto: recruiterPhotoUrl,
              id: jobData.recruiterId,
            });
          }
        }

        // Fetch messages for this job
        await fetchMessages();
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError('Failed to load conversation. Using demo data.');
        // Use demo data as fallback
        setMessages(DEMO_MESSAGES);
        setJob({
          title: 'Senior React Developer',
          company: 'TechVentures Inc',
        });
        setRecruiter({
          name: 'John Smith',
          id: 'recruiter-id',
        });
      } finally {
        setLoading(false);
      }
    };

    if (jobId && user?.id) {
      fetchJobDetails();
    }
  }, [jobId, user?.id]);

  // Fetch messages
  const fetchMessages = async () => {
    try {
      setLoadingMessages(true);
      const response = await api.get(`/messages/job/${jobId}`);

      if (response.data.success) {
        setMessages(response.data.messages || []);
      } else {
        // Use demo messages as fallback
        setMessages(DEMO_MESSAGES);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      // Use demo messages as fallback
      setMessages(DEMO_MESSAGES);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Send message handler
  const handleSendMessage = async (messageData) => {
    if (!messageData.message.trim() && messageData.attachments.length === 0) return;

    try {
      setSendingMessage(true);

      // Optimistic update
      const newMessage = {
        _id: Date.now().toString(),
        senderId: user?.id,
        receiver: recruiter?.id,
        text: messageData.message,
        timestamp: new Date().toISOString(),
        status: 'pending',
      };

      setMessages((prev) => [...prev, newMessage]);

      // API call
      const response = await api.post('/messages', {
        jobId: jobId,
        receiverId: recruiter?.id,
        message: messageData.message,
        attachments: messageData.attachments,
      });

      if (response.data.success) {
        // Update message status
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === newMessage._id
              ? { ...msg, _id: response.data.message._id, status: 'sent' }
              : msg
          )
        );

        // Mark all previous messages from recruiter as read
        try {
          await api.post(`/messages/mark-read/job/${jobId}`);
        } catch (err) {
          console.error('Error marking messages as read:', err);
        }
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

  if (loading) {
    return (
      <>
        <SeekerHeader />
        <div className="h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Loader size={40} className="text-emerald-600 mx-auto animate-spin mb-4" />
            <p className="text-gray-600">Loading conversation...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SeekerHeader />
      <div className="h-full bg-gray-50 flex flex-col">
        <div className="max-w-4xl mx-auto w-full h-screen lg:h-[calc(100vh-70px)] flex flex-col bg-white lg:border-x border-gray-200">
          {/* Chat Header */}
          <ChatHeader
            recruiter={recruiter}
            jobTitle={job?.title}
            isOnline={isOnline}
            onBackClick={() => navigate(-1)}
          />

          {/* Error Banner */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 border-b border-amber-200">
              <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-amber-800">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-amber-600 hover:text-amber-700"
              >
                ✕
              </button>
            </div>
          )}

          {/* Message List */}
          <MessageList
            messages={messages}
            loading={loadingMessages}
            userId={user?.id}
            onMessagesLoad={fetchMessages}
          />

          {/* Message Input */}
          <MessageInput
            onSendMessage={handleSendMessage}
            disabled={!recruiter}
            isLoading={sendingMessage}
            placeholder="Type your message here..."
          />
        </div>
      </div>
    </>
  );
};

export default JobSeekerMessages;
