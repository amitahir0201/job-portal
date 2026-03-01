import React from 'react';
import { Eye, Trash2, Calendar, Building2, Briefcase } from 'lucide-react';

const getStatusColor = (status) => {
  const colors = {
    New: 'bg-gray-100 text-gray-800',
    Reviewed: 'bg-blue-100 text-blue-800 border-blue-200',
    Shortlisted: 'bg-purple-100 text-purple-800 border-purple-200',
    'Interview Scheduled': 'bg-orange-100 text-orange-800 border-orange-200',
    Rejected: 'bg-red-100 text-red-800 border-red-200',
    Hired: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Withdrawn: 'bg-gray-200 text-gray-600 border-gray-300',
  };
  return colors[status] || 'bg-gray-100 text-gray-800 border-transparent';
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const ApplicationsTable = ({ applications = [], onViewDetails, onWithdraw }) => {
  const canWithdraw = (status) => !['Rejected', 'Hired', 'Withdrawn'].includes(status);

  if (!applications.length) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-dashed border-gray-300 text-gray-500">
        No applications found.
      </div>
    );
  }

  return (
    <div className="w-full max-w-full">
      {/* Desktop & Tablet Table (Visible from 'lg' screens) */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Job / Company</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Timeline</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {applications.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-4 max-w-[300px]">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 truncate" title={app.job?.title}>
                        {app.job?.title || 'Position Title'}
                      </span>
                      <span className="text-sm text-gray-500 truncate">{app.job?.companyName || 'Company'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs text-gray-600 space-y-1">
                      <p><span className="text-gray-400">Applied:</span> {formatDate(app.appliedAt)}</p>
                      <p><span className="text-gray-400">Updated:</span> {formatDate(app.updatedAt)}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onViewDetails(app)}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        aria-label="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      {canWithdraw(app.status) && (
                        <button
                          onClick={() => onWithdraw(app._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="Withdraw"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile & Small Tablet Cards (Visible below 'lg' screens) */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        {applications.map((app) => (
          <div key={app._id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 truncate pr-2">{app.job?.title || 'Job Title'}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <Building2 size={14} />
                  <span className="truncate">{app.job?.companyName || 'Company'}</span>
                </div>
              </div>
              <span className={`shrink-0 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(app.status)}`}>
                {app.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5 p-3 bg-gray-50 rounded-lg">
              <div className="space-y-1">
                <p className="text-[10px] text-gray-400 uppercase font-bold">Applied</p>
                <p className="text-sm text-gray-700 font-medium">{formatDate(app.appliedAt)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-gray-400 uppercase font-bold">Updated</p>
                <p className="text-sm text-gray-700 font-medium">{formatDate(app.updatedAt)}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => onViewDetails(app)}
                className="flex-1 py-2.5 bg-white border border-gray-200 hover:border-emerald-200 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 rounded-lg transition-all text-sm font-semibold flex items-center justify-center gap-2"
              >
                <Eye size={16} />
                Details
              </button>
              {canWithdraw(app.status) && (
                <button
                  onClick={() => onWithdraw(app._id)}
                  className="flex-1 py-2.5 bg-white border border-gray-200 hover:border-red-200 hover:bg-red-50 text-gray-700 hover:text-red-700 rounded-lg transition-all text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  Withdraw
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationsTable;