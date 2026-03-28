import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading } = useAuth();

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      // Redirect based on user role (backend uses 'seeker', but we also support 'jobseeker')
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (user.role === 'recruiter') {
        navigate('/recruiter', { replace: true });
      } else if (user.role === 'seeker' || user.role === 'jobseeker') {
        navigate('/job-seeker', { replace: true });
      }
    }
  }, [isAuthenticated, user, loading, navigate]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page only for unauthenticated users
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-green-50 via-white to-emerald-50 min-h-screen">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center animate-fade-in">
            {/* Left Content */}
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Connect Talent with <span className="text-green-600">Opportunity</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Welcome to JobHubnow - The modern, intuitive job portal connecting jobseekers with their dream opportunities and helping recruiters find top talent.
              </p>
              <div className="flex gap-4">
                <Link
                  to="/register?role=jobseeker"
                  className="btn-primary"
                >
                  🔍 Find Jobs
                </Link>
                <Link
                  to="/register?role=recruiter"
                  className="btn-outline"
                >
                  👔 Post Jobs
                </Link>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="relative h-96 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center animate-float">
              <div className="absolute inset-0 bg-gradient-to-br from-green-200 to-emerald-200 rounded-2xl opacity-20 animate-pulse"></div>
              <div className="relative z-10 text-6xl">💼</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="section bg-white border-t border-green-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Why Choose JobHub Pro?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Modern Interface</h3>
              <p className="text-gray-600">Beautiful, intuitive design that makes finding jobs effortless</p>
            </div>

            {/* Feature 2 */}
            <div className="card">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Secure & Private</h3>
              <p className="text-gray-600">Your data is protected with industry-leading security standards</p>
            </div>

            {/* Feature 3 */}
            <div className="card">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Fast & Reliable</h3>
              <p className="text-gray-600">Lightning-fast performance to help you get hired quickly</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="section bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-green-50 mb-8">Join thousands of professionals already using JobHub Pro</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="px-8 py-4 bg-white text-green-600 rounded-lg font-bold hover:bg-green-50 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-bold hover:bg-green-700 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">JobHub Pro</h4>
              <p className="text-sm">The modern way to find jobs.</p>
            </div>
            <div>
              <h5 className="text-white font-bold mb-4">For Jobseekers</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Search Jobs</a></li>
                <li><a href="#" className="hover:text-white">Profile</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold mb-4">For Recruiters</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Post Jobs</a></li>
                <li><a href="#" className="hover:text-white">Dashboard</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold mb-4">Company</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 JobHub Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
