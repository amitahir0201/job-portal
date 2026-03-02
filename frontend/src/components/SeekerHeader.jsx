import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  LayoutDashboard,
  Briefcase,
  Bookmark,
  FileText,
  MessageCircle,
  Bell,
  ChevronDown,
  User,
  Edit,
} from 'lucide-react';

const SeekerHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const profileDropdownRef = useRef(null);

  // Navigation items for job seeker (matching actual routes)
  const navigationItems = [
    { label: 'Dashboard', href: '/job-seeker-dashboard', icon: LayoutDashboard, title: 'View Your Dashboard' },
    { label: 'Jobs', href: '/jobs', icon: Briefcase, title: 'Browse All Jobs' },
    { label: 'Saved Jobs', href: '/saved-jobs', icon: Bookmark, title: 'View Saved Jobs' },
    { label: 'Applications', href: '/applications', icon: FileText, title: 'View Your Applications' },
    { label: 'Messages', href: '/messages', icon: MessageCircle, title: 'View Messages' },
  ];

  // Fetch unread notification count
  const fetchUnreadCount = async () => {
    try {
      const res = await api.get('/notifications/unread/count');
      setUnreadCount(res.data.unreadCount);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    // Fetch unread count on component mount
    fetchUnreadCount();

    // Set up interval to poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, []);

  // Handle close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isProfileDropdownOpen]);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  // Check if link is active
  const isActive = (href) => {
    return location.pathname === href ||
      location.pathname.startsWith(href + '/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link
            to="/job-seeker-dashboard"
            className="flex items-center gap-3 group"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-green-600 to-emerald-700 group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
              <span className="text-base font-bold text-white">JH</span>
            </div>
            <span className="text-lg font-bold text-gray-900 hidden sm:inline group-hover:text-green-600 transition-colors duration-300">
              JobHubNow
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  title={item.title}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                    isActive(item.href)
                      ? 'text-green-700 bg-green-50 shadow-sm'
                      : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Notification Bell */}
            <button
              onClick={() => navigate('/notifications')}
              className="relative p-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-300"
              aria-label="Notifications"
              title="View Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center min-w-4 h-4 px-1 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Profile Dropdown (Desktop) */}
            <div className="hidden sm:block relative" ref={profileDropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 group ${
                  isProfileDropdownOpen
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center text-white font-bold text-xs group-hover:scale-110 transition-transform duration-300">
                  {user?.name?.charAt(0).toUpperCase() || 'J'}
                </div>
                <div className="hidden md:flex flex-col items-start text-sm">
                  <span className="font-semibold text-gray-900">{user?.name || 'Job Seeker'}</span>
                  <span className="text-xs text-gray-500">{user?.email?.split('@')[0] || 'User'}</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-700 transition-transform duration-300 ${
                    isProfileDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl shadow-2xl bg-white border border-gray-200 py-1 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-xl">
                    <p className="text-sm font-bold text-gray-900">
                      {user?.name || 'Job Seeker'}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {user?.email}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-200 font-medium"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    title="View Your Profile"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </Link>

                  <Link
                    to="/profile/edit"
                    className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 font-medium"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    title="Edit Your Profile"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors duration-200 border-t border-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-300"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden border-t border-gray-100 py-3 space-y-1 animate-in slide-in-from-top-2 duration-300">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    isActive(item.href)
                      ? 'text-green-700 bg-green-50'
                      : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}

            {/* Mobile Profile Section */}
            <div className="px-4 py-3 border-t border-gray-100 mt-2">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center text-white font-bold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'J'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">
                    {user?.name || 'Job Seeker'}
                  </p>
                  <p className="text-xs text-gray-600">
                    {user?.email?.split('@')[0] || 'User'}
                  </p>
                </div>
              </div>

              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
                title="View Your Profile"
              >
                <User className="w-4 h-4" />
                My Profile
              </Link>

              <Link
                to="/profile/edit"
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors duration-200 font-medium mt-2"
                onClick={() => setIsMobileMenuOpen(false)}
                title="Edit Your Profile"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </Link>

              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 font-medium mt-2"
              >
                Logout
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default SeekerHeader;
