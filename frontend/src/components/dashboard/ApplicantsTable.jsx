import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Mail, Calendar, FileText, UserCheck } from 'lucide-react';

/**
 * ApplicantsTable Component
 * Displays list of applicants with responsive status management
 */
const ApplicantsTable = ({ 
  applicants = [], 
  loading = false,
  onStatusChange = null 
}) => {
  const [expandedApplicant, setExpandedApplicant] = useState(null);

  const statusOptions = [
    'New',
    'Reviewed',
    'Shortlisted',
    'Interview Scheduled',
    'Rejected',
    'Hired',
  ];

  const getStatusColor = (status) => {
    const statusColors = {
      'New': 'bg-blue-100 text-blue-800 border-blue-200',
      'Reviewed': 'bg-purple-100 text-purple-800 border-purple-200',
      'Shortlisted': 'bg-green-100 text-green-800 border-green-200',
      'Interview Scheduled': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Rejected': 'bg-red-100 text-red-800 border-red-200',
      'Hired': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Loading applicants...</p>
      </div>
    );
  }

  if (!applicants || applicants.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
        <UserCheck className="mx-auto text-gray-300 mb-3" size={48} />
        <p className="text-gray-600 font-medium">No applicants yet</p>
        <p className="text-sm text-gray-400">Applications will appear here once submitted.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {applicants.map((applicant) => (
        <div
          key={applicant._id}
          className={`bg-white rounded-xl border transition-all duration-200 ${
            expandedApplicant === applicant._id 
            ? 'border-emerald-300 shadow-md ring-1 ring-emerald-50' 
            : 'border-gray-200 hover:border-emerald-200 hover:shadow-sm'
          }`}
        >
          {/* Header Area */}
          <div 
            className="p-4 sm:p-5 cursor-pointer flex items-center justify-between gap-4"
            onClick={() => setExpandedApplicant(expandedApplicant === applicant._id ? null : applicant._id)}
          >
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <h3 className="font-bold text-gray-900 truncate">{applicant.name}</h3>
                <span className={`w-fit px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold border ${getStatusColor(applicant.status)}`}>
                  {applicant.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-0.5">{applicant.jobTitle}</p>
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                <Calendar size={12} />
                <span>Applied: {new Date(applicant.appliedDate).toLocaleDateString()}</span>
              </div>
            </div>

            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
              {expandedApplicant === applicant._id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>

          {/* Expanded Details Section */}
          {expandedApplicant === applicant._id && (
            <div className="px-4 pb-5 sm:px-5 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="pt-4 border-t border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg text-gray-500"><Mail size={16}/></div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Email Address</p>
                      <p className="text-sm font-medium text-gray-900 truncate">{applicant.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg text-gray-500"><UserCheck size={16}/></div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Process Status</p>
                      <p className="text-sm font-medium text-gray-900">{applicant.status}</p>
                    </div>
                  </div>
                </div>

                {/* Actions Container */}
                <div className="mt-6 flex flex-col lg:flex-row gap-3">
                  <div className="flex-1">
                    <select
                      defaultValue={applicant.status}
                      onChange={(e) => onStatusChange && onStatusChange(applicant._id, e.target.value)}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          Update to: {status}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm">
                      <Calendar size={16} />
                      <span>Interview</span>
                    </button>
                    
                    <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors">
                      <FileText size={16} />
                      <span>Resume</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ApplicantsTable;