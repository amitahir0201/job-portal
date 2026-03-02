import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Calculate password strength
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { level: 0, text: '', color: '' };
    if (pwd.length < 6) return { level: 1, text: 'Weak', color: 'text-red-600' };
    if (pwd.length < 10 || !/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd)) {
      return { level: 2, text: 'Fair', color: 'text-yellow-600' };
    }
    return { level: 3, text: 'Strong', color: 'text-emerald-600' };
  };

  const strength = getPasswordStrength(password);

  // Validate form
  const validate = () => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (!confirmPassword) return 'Please confirm your password';
    if (password !== confirmPassword) return 'Passwords do not match';
    return null;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validate();
    if (validationError) {
      return setError(validationError);
    }

    try {
      setLoading(true);
      const response = await api.post(
        `/auth/reset-password/${token}`,
        { password }
      );

      if (response.data?.success) {
        setSuccess('Password reset successful! Redirecting to login...');

        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Unable to reset password';
      
      if (errorMessage.includes('expired')) {
        setError('Your reset link has expired. Please request a new one.');
      } else if (errorMessage.includes('invalid')) {
        setError('Invalid reset link. Please request a new password reset.');
      } else {
        setError(errorMessage);
      }

      console.error('Reset password error:', err);
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Password</h1>
            <p className="text-gray-600">Choose a strong password for your account.</p>
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
            </div>
          )}

          {/* Form */}
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition disabled:bg-gray-50 pr-10"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">Password strength:</span>
                      <span className={`text-xs font-semibold ${strength.color}`}>
                        {strength.text}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          strength.level === 1
                            ? 'w-1/3 bg-red-500'
                            : strength.level === 2
                            ? 'w-2/3 bg-yellow-500'
                            : 'w-full bg-emerald-500'
                        }`}
                      />
                    </div>
                    <ul className="mt-2 text-xs text-gray-600 space-y-1">
                      <li className={password.length >= 6 ? 'text-emerald-600' : ''}>
                        {password.length >= 6 ? '✓' : '○'} At least 6 characters
                      </li>
                      <li
                        className={
                          /[A-Z]/.test(password) && /[a-z]/.test(password)
                            ? 'text-emerald-600'
                            : ''
                        }
                      >
                        {/[A-Z]/.test(password) && /[a-z]/.test(password) ? '✓' : '○'} Mix of
                        uppercase and lowercase
                      </li>
                      <li className={/[0-9]/.test(password) ? 'text-emerald-600' : ''}>
                        {/[0-9]/.test(password) ? '✓' : '○'} At least one number
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition disabled:bg-gray-50 pr-10"
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirm ? '🙈' : '👁️'}
                  </button>
                </div>

                {/* Password Match Indicator */}
                {confirmPassword && (
                  <div className="mt-2">
                    <p
                      className={`text-xs font-medium ${
                        password === confirmPassword
                          ? 'text-emerald-600'
                          : 'text-red-600'
                      }`}
                    >
                      {password === confirmPassword
                        ? '✓ Passwords match'
                        : '✗ Passwords do not match'}
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !password || !confirmPassword}
                className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Resetting...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <button
                onClick={() => navigate('/login')}
                className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition"
              >
                Go to Login
              </button>
            </div>
          )}

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

export default ResetPassword;
