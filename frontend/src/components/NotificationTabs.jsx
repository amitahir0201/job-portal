import React from 'react';

const NotificationTabs = ({ activeFilter, setActiveFilter, notifications }) => {
  const tabs = [
    { id: 'all', label: 'All', count: notifications.length },
    {
      id: 'application',
      label: 'Applications',
      count: notifications.filter((n) => n.type === 'application').length,
    },
    {
      id: 'interview',
      label: 'Interviews',
      count: notifications.filter((n) => n.type === 'interview').length,
    },
    {
      id: 'message',
      label: 'Messages',
      count: notifications.filter((n) => n.type === 'message').length,
    },
    {
      id: 'job',
      label: 'Jobs',
      count: notifications.filter((n) => n.type === 'job').length,
    },
  ];

  return (
    <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveFilter(tab.id)}
          className={`px-4 py-2 rounded-full font-semibold transition whitespace-nowrap flex items-center gap-2 ${
            activeFilter === tab.id
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white border border-gray-200 text-gray-700 hover:border-emerald-300'
          }`}
        >
          {tab.label}
          {tab.count > 0 && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              activeFilter === tab.id
                ? 'bg-white bg-opacity-30'
                : 'bg-gray-100'
            }`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default NotificationTabs;
