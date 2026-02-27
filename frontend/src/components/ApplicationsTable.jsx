import React from 'react';
import { Eye, Trash2, Calendar } from 'lucide-react';

const getStatusColor = (status) => {
  const colors = {
    New: 'bg-gray-100 text-gray-800',
    Reviewed: 'bg-blue-100 text-blue-800',
    Shortlisted: 'bg-purple-100 text-purple-800',
    'Interview Scheduled': 'bg-orange-100 text-orange-800',
    Rejected: 'bg-red-100 text-red-800',
    Hired: 'bg-emerald-100 text-emerald-800',
    Withdrawn: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const ApplicationsTable = ({ applications, onViewDetails, onWithdraw }) => {
  const canWithdraw = (status) => {
    return !['Rejected', 'Hired', 'Withdrawn'].includes(status);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Job Title</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Company</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Applied</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Updated</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, idx) => (
              <tr key={app._id} className={`${idx !== applications.length - 1 ? 'border-b border-gray-200' : ''} hover:bg-gray-50 transition`}>
                <td className="px-6 py-4">
                  <p className="font-semibold text-gray-900">{app.job?.title || 'Job Title'}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-gray-700">{app.job?.companyName || 'Company'}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-600">{formatDate(app.appliedAt)}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-600">{formatDate(app.updatedAt)}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewDetails(app)}
                      className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition"
                      title="View details"
                    >
                      <Eye size={18} />
                    </button>
                    {canWithdraw(app.status) && (
                      <button
                        onClick={() => onWithdraw(app._id)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition"
                        title="Withdraw application"
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

      {/* Mobile Cards */}
      <div className="md:hidden p-4 space-y-4">
        {applications.map((app) => (
          <div key={app._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
            <div className="mb-3">
              <h3 className="font-bold text-gray-900">{app.job?.title || 'Job Title'}</h3>
              <p className="text-sm text-gray-600">{app.job?.companyName || 'Company'}</p>
            </div>

            <div className="mb-3">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(app.status)}`}>
                {app.status}
              </span>
            </div>

            <div className="mb-4 space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <span>Applied: {formatDate(app.appliedAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <span>Updated: {formatDate(app.updatedAt)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onViewDetails(app)}
                className="flex-1 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition font-semibold flex items-center justify-center gap-2"
              >
                <Eye size={16} />
                View Details
              </button>
              {canWithdraw(app.status) && (
                <button
                  onClick={() => onWithdraw(app._id)}
                  className="flex-1 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition font-semibold flex items-center justify-center gap-2"
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
