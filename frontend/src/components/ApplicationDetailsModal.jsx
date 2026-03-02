import React from 'react';
import { X, Download, Trash2, MapPin, DollarSign, Briefcase, Github, Linkedin, Globe, FileText } from 'lucide-react';
import api from '../services/api';
import { getFullImageUrl } from '../utils/imageUtils';
import StatusTimeline from './StatusTimeline';

const getStatusColor = (status) => {
  const colors = {
    New: 'bg-gray-100 text-gray-800',
    Reviewed: 'bg-blue-100 text-blue-800',
    Shortlisted: 'bg-purple-100 text-purple-800',
    'Interview Scheduled': 'bg-orange-100 text-orange-800',
    Rejected: 'bg-red-100 text-red-800',
    Hired: 'bg-emerald-100 text-emerald-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const ApplicationDetailsModal = ({ application, isOpen, onClose, onWithdraw }) => {
  if (!isOpen) return null;

  const canWithdraw = !['Rejected', 'Hired'].includes(application.status);

  // Function to download resume with proper URL handling
  const downloadResume = (resumeUrl, resumeName) => {
    const fullUrl = getFullImageUrl(resumeUrl);
    
    if (!fullUrl) {
      alert('Resume URL not available');
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = fullUrl;
      link.setAttribute('download', resumeName || 'resume.pdf');
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
    } catch (error) {
      console.error('Error downloading file:', error);
      window.open(fullUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <style>{`
        .modal-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .modal-scrollbar::-webkit-scrollbar-track {
          background: #f3f4f6;
        }
        .modal-scrollbar::-webkit-scrollbar-thumb {
          background: #10b981;
          border-radius: 4px;
        }
        .modal-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #059669;
        }
      `}</style>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto modal-scrollbar">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{application.job?.title}</h2>
            <p className="text-emerald-100 text-sm mt-1">{application.job?.companyName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div>
            <p className="text-xs font-bold text-gray-600 uppercase mb-2">Application Status</p>
            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-full font-bold text-xs ${getStatusColor(application.status)}`}>
                {application.status}
              </span>
              <p className="text-sm text-gray-600">Applied on {formatDate(application.appliedAt)}</p>
            </div>
          </div>

          {/* Job Information */}
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
            <h3 className="font-bold text-gray-900 mb-4">Job Details</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-emerald-600" />
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Location</p>
                  <p className="text-gray-900 font-semibold">{application.job?.location}</p>
                </div>
              </div>

              {(application.job?.salaryMin || application.job?.salaryMax) && (
                <div className="flex items-center gap-3">
                  <DollarSign size={18} className="text-emerald-600" />
                  <div>
                    <p className="text-xs text-gray-600 font-semibold">Salary Range</p>
                    <p className="text-gray-900 font-semibold">
                      {application.job?.currency}
                      {application.job?.salaryMin?.toLocaleString()} - {application.job?.currency}
                      {application.job?.salaryMax?.toLocaleString()}/year
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Briefcase size={18} className="text-emerald-600" />
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Job Type</p>
                  <p className="text-gray-900 font-semibold">{application.job?.jobType || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Your Submission</h3>
            <div className="space-y-4">
              {/* Application Resume */}
              <div>
                <p className="text-xs font-bold text-gray-600 uppercase mb-2">Resume (Submitted with Application)</p>
                {application.resumeURL ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('Application Resume clicked:', application.resumeURL);
                      downloadResume(application.resumeURL, `application-${application._id}.pdf`);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-100 transition font-semibold w-full justify-center cursor-pointer"
                  >
                    <Download size={16} />
                    Download Application Resume
                  </button>
                ) : (
                  <p className="text-gray-500 text-sm">No resume provided with application</p>
                )}
              </div>

              {/* Profile Resume */}
              <div>
                <p className="text-xs font-bold text-gray-600 uppercase mb-2">Resume (From Profile)</p>
                {application.applicant && application.applicant.resumeURL ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('Profile Resume clicked:', application.applicant.resumeURL);
                      downloadResume(application.applicant.resumeURL, `profile-${application.applicant._id}.pdf`);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-lg hover:bg-emerald-100 transition font-semibold w-full justify-center cursor-pointer"
                  >
                    <Download size={16} />
                    Download Profile Resume
                  </button>
                ) : (
                  <p className="text-gray-500 text-sm">No resume uploaded on profile</p>
                )}
              </div>

              {/* Cover Letter */}
              {application.coverLetter && (
                <div>
                  <p className="text-xs font-bold text-gray-600 uppercase mb-2">Cover Letter</p>
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">{application.coverLetter}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Professional Links */}
          {(application.linkedinLink || application.githubLink || application.portfolioLink || application.majorProjectLink) && (
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Professional Links</h3>
              <div className="space-y-2">
                {application.linkedinLink && (
                  <a
                    href={application.linkedinLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-blue-300 transition"
                  >
                    <Linkedin size={18} className="text-blue-600" />
                    <span className="text-gray-700 font-semibold">LinkedIn Profile</span>
                  </a>
                )}

                {application.githubLink && (
                  <a
                    href={application.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-gray-400 transition"
                  >
                    <Github size={18} className="text-gray-900" />
                    <span className="text-gray-700 font-semibold">GitHub Profile</span>
                  </a>
                )}

                {application.portfolioLink && (
                  <a
                    href={application.portfolioLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-emerald-300 transition"
                  >
                    <Globe size={18} className="text-emerald-600" />
                    <span className="text-gray-700 font-semibold">Portfolio</span>
                  </a>
                )}

                {application.majorProjectLink && (
                  <a
                    href={application.majorProjectLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-purple-300 transition"
                  >
                    <FileText size={18} className="text-purple-600" />
                    <span className="text-gray-700 font-semibold">Major Project</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Custom Questions & Answers */}
          {application.answers && application.answers.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Screening Answers</h3>
              <div className="space-y-4">
                {application.answers.map((answer, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm font-bold text-gray-900 mb-2">Q{idx + 1}: {answer.question}</p>
                    <p className="text-gray-700">{answer.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Timeline */}
          <div className="border-t border-gray-200 pt-6">
            <StatusTimeline currentStatus={application.status} />
          </div>

          {/* Action Buttons */}
          <div className="border-t border-gray-200 pt-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition font-bold"
            >
              Close
            </button>
            {canWithdraw && (
              <button
                onClick={onWithdraw}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-bold flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                Withdraw Application
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailsModal;
