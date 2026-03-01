import React from 'react';

const SectionCard = ({ title, icon, description, children }) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-md border border-green-100 overflow-hidden hover:shadow-lg transition-all duration-300 ease-in-out">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-4 sm:px-6 sm:py-5 border-b border-green-100">
        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
          {/* Icon Container - Shrink-0 ensures icon doesn't squish */}
          <div className="text-green-600 bg-white p-2 rounded-lg shadow-sm border border-green-100 shrink-0">
            {icon}
          </div>
          
          {/* Text Container - min-w-0 allows truncate or wrap to work correctly */}
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight truncate sm:whitespace-normal">
              {title}
            </h3>
            {description && (
              <p className="mt-0.5 text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2 sm:line-clamp-none">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-4 py-5 sm:px-6 sm:py-6 bg-white">
        {/* We use a wrapper here to ensure children don't overflow the rounded corners */}
        <div className="w-full h-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SectionCard;