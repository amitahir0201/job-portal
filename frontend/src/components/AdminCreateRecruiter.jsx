import React, { useState } from 'react';
import axios from 'axios';
import { sendRecruiterInvitation } from '../services/adminEmailService';

const AdminCreateRecruiter = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    companyName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [recruiterData, setRecruiterData] = useState(null);

  /**
   * Handle form input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Submit form to create recruiter
   */
  const handleCreateRecruiter = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate form
    if (!formData.fullName.trim() || !formData.email.trim()) {
      return setError('Full name and email are required');
    }

    try {
      setLoading(true);

      console.log('[AdminCreateRecruiter] Creating recruiter:', formData.email);

      // 1️⃣ Call backend to create recruiter
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/create-recruiter`,
        formData
      );

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to create recruiter');
      }

      console.log('[AdminCreateRecruiter] Recruiter created:', response.data.recruiter.email);

      // ✅ Save recruiter data for later use
      setRecruiterData(response.data);

      // 2️⃣ Send invitation email via EmailJS
      console.log('[AdminCreateRecruiter] Sending invitation email...');
      const emailResult = await sendRecruiterInvitation(response.data.emailData);

      if (!emailResult.success) {
        // Email failed but recruiter was created
        setError(
          `Recruiter created but email failed: ${emailResult.message}. ` +
          'You can resend the invitation using the button below.'
        );
      } else {
        // Success
        setSuccess(
          `Recruiter ${formData.fullName} created and invitation email sent to ${formData.email}`
        );
        setFormData({ fullName: '', email: '', companyName: '' });
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to create recruiter';
      setError(errorMessage);
      console.error('[AdminCreateRecruiter] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resend invitation email to already-created recruiter
   */
  const handleResendInvitation = async () => {
    if (!recruiterData?.emailData) {
      setError('No recruiter data available');
      return;
    }

    try {
      setLoading(true);

      console.log('[AdminCreateRecruiter] Resending invitation to:', recruiterData.emailData.to_email);
      const emailResult = await sendRecruiterInvitation(recruiterData.emailData);

      if (!emailResult.success) {
        throw new Error(emailResult.message);
      }

      setSuccess(`Invitation resent to ${recruiterData.recruiter.email}`);
    } catch (err) {
      setError(`Failed to resend: ${err.message}`);
      console.error('[AdminCreateRecruiter] Resend error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Create Recruiter Account</h2>

      {/* Error Alert */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm font-medium text-red-900">Error</p>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm font-medium text-green-900">Success!</p>
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      {/* Form */}
      {!recruiterData && (
        <form onSubmit={handleCreateRecruiter} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              disabled={loading}
              placeholder="e.g., John Doe"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              placeholder="e.g., john@company.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              disabled={loading}
              placeholder="e.g., Acme Corp"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
          >
            {loading ? 'Creating & Sending Email...' : 'Create Recruiter & Send Invite'}
          </button>
        </form>
      )}

      {/* Success State: Show Recruiter Details */}
      {recruiterData && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Recruiter Created</h3>
            <p className="text-sm text-blue-800 mb-1">
              <strong>Name:</strong> {recruiterData.recruiter.fullName}
            </p>
            <p className="text-sm text-blue-800 mb-1">
              <strong>Email:</strong> {recruiterData.recruiter.email}
            </p>
            <p className="text-sm text-blue-800">
              <strong>Company:</strong> {recruiterData.recruiter.companyName || 'N/A'}
            </p>
          </div>

          <p className="text-sm text-gray-600 text-center">
            Invitation email has been sent to <strong>{recruiterData.recruiter.email}</strong>
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setRecruiterData(null);
                setFormData({ fullName: '', email: '', companyName: '' });
                setSuccess('');
              }}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
            >
              Create Another
            </button>

            <button
              onClick={handleResendInvitation}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
            >
              Resend Email
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCreateRecruiter;
