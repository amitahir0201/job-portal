import React from 'react';
import { ArrowLeft, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InterviewHeader = ({ application, interview }) => {
  const navigate = useNavigate();

  const getStatusBadge = () => {
    const statuses = {
      Scheduled: { bg: 'bg-orange-100', text: 'text-orange-800', icon: Clock, label: 'Scheduled' },
      Confirmed: { bg: 'bg-blue-100', text: 'text-blue-800', icon: CheckCircle, label: 'Confirmed' },
      Completed: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Completed' },
      Cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, label: 'Cancelled' },
    };

    const status = statuses[interview?.status] || statuses.Scheduled;
    const Icon = status.icon;

    return (
      <div className={`${status.bg} ${status.text} inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-semibold text-sm`}>
        <Icon size={16} />
        {status.label}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/applications')}
        className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold mb-4 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Applications
      </button>

      {/* Header Content */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:items-start">
          {/* Job Info */}
          <div className="col-span-1 sm:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {application?.jobId?.title}
            </h1>
            <p className="text-lg text-gray-600">
              {application?.jobId?.company?.name}
            </p>
            {application?.jobId?.company?.logo && (
              <img
                src={application.jobId.company.logo}
                alt={application.jobId.company.name}
                className="h-8 mt-3"
              />
            )}
          </div>

          {/* Status Badge */}
          <div className="flex justify-end items-start">
            {getStatusBadge()}
          </div>
        </div>

        {/* Interview Timeline Info */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div>
              <p className="text-gray-600 font-medium">Interview Date</p>
              <p className="text-gray-900 font-semibold">
                {new Date(interview?.interviewDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Interview Time</p>
              <p className="text-gray-900 font-semibold">
                {interview?.interviewTime}
              </p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Type</p>
              <div className="flex items-center gap-1 text-gray-900 font-semibold">
                <span className={`inline-block w-2 h-2 rounded-full ${
                  interview?.interviewType === 'Online' ? 'bg-blue-500' : 'bg-purple-500'
                }`}></span>
                {interview?.interviewType}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewHeader;
