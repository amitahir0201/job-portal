import React from 'react';
import { FileText, CheckCircle, XCircle, Clock, AlertCircle, Award } from 'lucide-react';

const ApplicationStatusCards = ({ statusCounts }) => {
  const statusConfig = [
    {
      status: 'New',
      color: 'bg-gray-50',
      borderColor: 'border-gray-200',
      textColor: 'text-gray-700',
      countColor: 'text-gray-600',
      icon: FileText,
      bgIcon: 'bg-gray-100',
      iconColor: 'text-gray-600',
    },
    {
      status: 'Reviewed',
      color: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      countColor: 'text-blue-600',
      icon: CheckCircle,
      bgIcon: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      status: 'Shortlisted',
      color: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      countColor: 'text-purple-600',
      icon: AlertCircle,
      bgIcon: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      status: 'Interview Scheduled',
      color: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-700',
      countColor: 'text-orange-600',
      icon: Clock,
      bgIcon: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
    {
      status: 'Rejected',
      color: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-700',
      countColor: 'text-red-600',
      icon: XCircle,
      bgIcon: 'bg-red-100',
      iconColor: 'text-red-600',
    },
    {
      status: 'Hired',
      color: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700',
      countColor: 'text-emerald-600',
      icon: Award,
      bgIcon: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {statusConfig.map((config) => {
        const Icon = config.icon;
        const count = statusCounts[config.status] || 0;

        return (
          <div
            key={config.status}
            className={`${config.color} border ${config.borderColor} rounded-xl p-5 transition hover:shadow-md cursor-pointer`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`${config.bgIcon} p-2 rounded-lg`}>
                <Icon size={20} className={config.iconColor} />
              </div>
            </div>
            <p className={`text-2xl font-bold ${config.countColor}`}>{count}</p>
            <p className={`text-xs font-semibold ${config.textColor} mt-1 truncate`}>{config.status}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ApplicationStatusCards;
