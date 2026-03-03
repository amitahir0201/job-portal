import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { sendRecruiterInvitationEmail } from '../services/emailService';
import {
  Briefcase,
  Users,
  Shield,
  Mail,
  Building2,
  CheckCircle,
  AlertCircle,
  Trash2,
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    companyName: '',
  });

  const [stats, setStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    recruiterUsers: 0,
    seekerUsers: 0,
  });

  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingRecruiters, setLoadingRecruiters] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const response = await api.get('/admin/dashboard-stats');
        if (response.data.success) {
          setStats(response.data.stats);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  // Fetch recruiters
  useEffect(() => {
    const fetchRecruiters = async () => {
      try {
        setLoadingRecruiters(true);
        const response = await api.get('/admin/recruiters');
        if (response.data.success) {
          setRecruiters(response.data.recruiters);
        }
      } catch (err) {
        console.error('Error fetching recruiters:', err);
      } finally {
        setLoadingRecruiters(false);
      }
    };

    fetchRecruiters();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.fullName.trim() || !formData.email.trim()) {
      setError('Name and email are required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Invalid email address');
      return;
    }

    try {
      setLoading(true);
      console.log('[AdminDashboard] Creating recruiter:', formData.email);

      // 1️⃣ Call backend to create recruiter
      const response = await api.post('/admin/create-recruiter', {
        fullName: formData.fullName,
        email: formData.email,
        companyName: formData.companyName,
      });

      if (response.data.success) {
        console.log('[AdminDashboard] Recruiter created successfully');

        // 2️⃣ Send invitation email via EmailJS
        if (response.data.emailData) {
          console.log('[AdminDashboard] Sending invitation email to:', response.data.emailData.to_email);
          
          const emailResult = await sendRecruiterInvitationEmail(
            response.data.emailData.to_email,      // recruiter's email
            response.data.emailData.user_name,     // recruiter's name
            response.data.emailData.reset_link     // password setup link
          );

          if (emailResult.success) {
            console.log('[AdminDashboard] Email sent successfully');
            setSuccess(`✅ Recruiter created! Password setup email sent to ${formData.email}`);
          } else {
            console.error('[AdminDashboard] Email failed:', emailResult.message);
            setSuccess(`✅ Recruiter created but email failed. Try resending later.`);
          }
        }

        setFormData({ fullName: '', email: '', companyName: '' });
        
        // 3️⃣ Refresh recruiters list
        const recruitersRes = await api.get('/admin/recruiters');
        if (recruitersRes.data.success) {
          setRecruiters(recruitersRes.data.recruiters);
        }

        // Clear success message after 5 seconds
        setTimeout(() => setSuccess(''), 5000);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create recruiter';
      setError(errorMessage);
      console.error('[AdminDashboard] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecruiter = async (recruiterId, recruiterName) => {
    // Confirm deletion
    if (!window.confirm(`Are you sure you want to delete recruiter "${recruiterName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingId(recruiterId);
      setError('');

      // Get token from localStorage for debugging
      const token = localStorage.getItem('token');
      console.log('[AdminDashboard] Attempting to delete recruiter:', {
        recruiterId,
        recruiterName,
        hasToken: !!token,
        tokenLength: token ? token.length : 0
      });

      const response = await api.delete(`/admin/recruiters/${recruiterId}`);

      if (response.data.success) {
        // Remove the deleted recruiter from the list
        setRecruiters(recruiters.filter(r => r._id !== recruiterId));
        setSuccess(`✅ ${recruiterName} has been deleted successfully`);
        
        // Refresh stats
        const statsRes = await api.get('/admin/dashboard-stats');
        if (statsRes.data.success) {
          setStats(statsRes.data.stats);
        }

        // Clear success message after 5 seconds
        setTimeout(() => setSuccess(''), 5000);
      }
    } catch (err) {
      console.log('[AdminDashboard] Delete Error Details:', {
        status: err.response?.status,
        message: err.response?.data?.message,
        url: err.config?.url,
        headers: err.config?.headers,
        fullError: err
      });
      
      const errorMessage = err.response?.data?.message || 'Failed to delete recruiter';
      setError(errorMessage);
      console.error('[AdminDashboard] Delete Error:', err);
    } finally {
      setDeletingId(null);
    }
  };

  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage system users and recruiter registrations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {loadingStats ? '-' : stats.totalUsers}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Admins</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {loadingStats ? '-' : stats.adminUsers}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Recruiters</p>
                <p className="text-3xl font-bold text-emerald-600 mt-2">
                  {loadingStats ? '-' : stats.recruiterUsers}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Job Seekers</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">
                  {loadingStats ? '-' : stats.seekerUsers}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Recruiter Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Mail className="w-6 h-6 text-emerald-600" />
                Invite Recruiter
              </h2>

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-green-800 font-semibold">{success}</p>
                    <p className="text-green-700 text-sm mt-1">
                      Password reset email has been sent to the recruiter's email address.
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="recruiter@company.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Your Company"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending Invite...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      Send Invitation
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-900 text-sm">
                  <span className="font-semibold">How it works:</span><br/>
                  1. Enter recruiter details<br/>
                  2. Invitation email is sent<br/>
                  3. Recruiter clicks reset link<br/>
                  4. Sets their own password<br/>
                  5. Can then log in
                </p>
              </div>
            </div>
          </div>

          {/* Recruiters List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-emerald-600" />
                Registered Recruiters ({recruiters.length})
              </h2>

              {loadingRecruiters ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                </div>
              ) : recruiters.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No recruiters yet. Invite one to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recruiters.map((recruiter) => (
                    <div
                      key={recruiter._id}
                      className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:border-emerald-300 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {recruiter.fullName}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{recruiter.email}</p>
                        {recruiter.companyName && (
                          <p className="text-sm text-emerald-600 font-medium mt-1">
                            {recruiter.companyName}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 ml-2 flex-shrink-0">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full whitespace-nowrap">
                          Recruiter
                        </span>
                        <button
                          onClick={() => handleDeleteRecruiter(recruiter._id, recruiter.fullName)}
                          disabled={deletingId === recruiter._id}
                          className="p-1.5 sm:px-3 sm:py-1 bg-red-100 text-red-700 hover:bg-red-200 text-xs font-semibold rounded transition-colors disabled:bg-gray-200 disabled:text-gray-400 flex items-center gap-1"
                          title="Delete recruiter"
                        >
                          {deletingId === recruiter._id ? (
                            <>
                              <div className="w-3 h-3 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
                              <span className="hidden sm:inline">Deleting...</span>
                            </>
                          ) : (
                            <>
                              <Trash2 className="w-3 h-3" />
                              <span className="hidden sm:inline">Delete</span>
                            </>
                          )}
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
