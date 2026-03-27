import React from 'react';

/**
 * StatsCard Component
 * Displays a single statistics card with responsive layout and fluid typography
 */
const StatsCard = ({ 
  icon: Icon, 
  label, 
  value, 
  trend = null,
  color = 'emerald' 
}) => {
  const colorMap = {
    emerald: { border: 'border-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-600', trendUp: 'text-emerald-700', icon: 'text-emerald-600' },
    blue: { border: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-600', trendUp: 'text-blue-700', icon: 'text-blue-600' },
    green: { border: 'border-green-500', bg: 'bg-green-50', text: 'text-green-600', trendUp: 'text-green-700', icon: 'text-green-600' },
    purple: { border: 'border-purple-500', bg: 'bg-purple-50', text: 'text-purple-600', trendUp: 'text-purple-700', icon: 'text-purple-600' },
  };

  const colors = colorMap[color] || colorMap.emerald;

  return (
    <div className={`group bg-white rounded-xl shadow-sm p-4 sm:p-6 border-l-4 ${colors.border} hover:shadow-md transition-all duration-300`}>
      <div className="flex items-start justify-between gap-2">
        {/* Text Content */}
        <div className="min-w-0 flex-1">
          <p className="text-gray-500 text-xs sm:text-sm font-bold uppercase tracking-wider truncate">
            {label}
          </p>
          <div className="flex items-baseline gap-2 mt-1 sm:mt-2">
            <p className={`text-2xl sm:text-3xl font-black ${colors.text} tabular-nums`}>
              {value}
            </p>
          </div>
          
          {trend !== null && (
            <div className="flex items-center gap-1.5 mt-2">
              <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                trend >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {trend >= 0 ? '↑' : '↓'}
              </span>
              <p className={`text-[11px] sm:text-xs font-medium ${
                trend >= 0 ? 'text-green-700' : 'text-red-700'
              }`}>
                <span className="font-bold">{Math.abs(trend)}%</span>
                <span className="text-gray-400 ml-1 hidden xs:inline">vs last month</span>
              </p>
            </div>
          )}
        </div>

        {/* Icon Container */}
        <div className={`shrink-0 p-3 sm:p-4 rounded-2xl ${colors.bg} ${colors.icon} transition-transform duration-300 group-hover:scale-110`}>
          <Icon size={24} className="sm:w-8 sm:h-8" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;