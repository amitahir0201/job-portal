import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { sendResetPasswordEmail } from '../services/emailService';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Email validation regex
  const validateEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      return setError('Please enter your email address');
    }

    if (!validateEmail(email)) {
      return setError('Please enter a valid email address');
    }

    try {
      setLoading(true);

      // 1️⃣ Call backend to generate reset token
      console.log('[ForgotPassword] Requesting password reset for:', email);
      const response = await api.post(
        '/auth/forgot-password',
        { email: email.toLowerCase().trim() }
      );

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Something went wrong");
      }

      console.log('[ForgotPassword] Backend response:', response.data);
      
      const { name, resetUrl } = response.data;

      // 2️⃣ Send email via EmailJS with DYNAMIC recipient email
      console.log('[ForgotPassword] Sending reset email to:', email);
      const emailResult = await sendResetPasswordEmail(
        email, // ✅ Dynamic: recipient's email
        name || 'User', // ✅ Dynamic: user's name
        resetUrl // ✅ Reset link from backend
      );

      if (!emailResult.success) {
        throw new Error(emailResult.message);
      }

      console.log('[ForgotPassword] Email sent successfully');
      setSuccess('Check your email for password reset instructions.');
      setEmail('');

      // Redirect to login after 4 seconds
      setTimeout(() => {
        navigate('/login');
      }, 4000);

    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Unable to process request. Please try again.';
      setError(errorMessage);
      console.error('[ForgotPassword] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
            <p className="text-gray-600">Enter your email and we'll send you a reset link.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-medium text-red-900">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="text-sm font-medium text-emerald-900">Success!</p>
              <p className="text-sm text-emerald-700">{success}</p>
              <p className="text-xs text-emerald-600 mt-2">Redirecting to login...</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition disabled:bg-gray-50"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Remember your password?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-emerald-600 hover:text-emerald-700 font-semibold transition"
              >
                Sign in
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;