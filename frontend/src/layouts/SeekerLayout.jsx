import React from 'react';
import SeekerHeader from '../components/SeekerHeader';

/**
 * SeekerLayout Component
 * Wraps job seeker pages with header and consistent styling
 */
const SeekerLayout = ({ children, notificationCount = 0 }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SeekerHeader notificationCount={notificationCount} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {children}
      </main>
    </div>
  );
};

export default SeekerLayout;
