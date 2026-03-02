import React from 'react';
import { ArrowLeft, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getFullImageUrl } from '../utils/imageUtils';

const ChatHeader = ({ recruiter, jobTitle, isOnline, onBackClick }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center justify-between p-4">
        {/* Left Section - Back Button and Recruiter Info */}
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={handleBack}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>

          {/* Recruiter Avatar and Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <img
                src={getFullImageUrl(recruiter?.profilePhoto) || `https://ui-avatars.com/api/?name=${recruiter?.name || 'Recruiter'}&background=10b981&color=fff`}
                alt={recruiter?.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              {isOnline && (
                <Circle size={12} className="absolute bottom-0 right-0 fill-green-500 text-green-500" />
              )}
            </div>

            {/* Recruiter Details */}
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-gray-900 truncate">{recruiter?.name || 'Recruiter'}</h2>
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-600 truncate">{jobTitle || 'Job Position'}</p>
                <span
                  className={`text-xs font-medium ${
                    isOnline ? 'text-green-600' : 'text-gray-500'
                  }`}
                >
                  {isOnline ? '● Active' : '● Away'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2 sm:gap-4 ml-2">
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Call recruiter"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
