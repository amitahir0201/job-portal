import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit2,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Send,
  Eye,
} from 'lucide-react';
import api from '../services/api';
import RecruiterLayout from '../layouts/RecruiterLayout';
import SectionCard from '../components/PostJob/SectionCard';
import SkillsInput from '../components/PostJob/SkillsInput';

const JobDetailsEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    jobType: '',
    experienceLevel: '',
    salaryMin: '',
    salaryMax: '',
    currency: 'USD',
    description: '',
    requiredSkills: [],
    applicationDeadline: '',
    customQuestions: [],
    requiredLinks: {},
    status: 'Draft',
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  // Fetch job details
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/jobs/${id}`);
        if (res.data.success) {
          setJob(res.data.job);
          setFormData({
            title: res.data.job.title || '',
            location: res.data.job.location || '',
            jobType: res.data.job.jobType || 'Full-Time',
            experienceLevel: res.data.job.experienceLevel || 'Mid',
            salaryMin: res.data.job.salaryMin || '',
            salaryMax: res.data.job.salaryMax || '',
            currency: res.data.job.currency || 'USD',
            description: res.data.job.description || '',
            requiredSkills: res.data.job.requiredSkills || [],
            applicationDeadline: res.data.job.applicationDeadline
              ? res.data.job.applicationDeadline.split('T')[0]
              : '',
            customQuestions: res.data.job.customQuestions || [],
            requiredLinks: res.data.job.requiredLinks || {},
            status: res.data.job.status || 'Draft',
          });
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';

    if (formData.salaryMin && formData.salaryMax && formData.salaryMin > formData.salaryMax) {
      newErrors.salary = 'Minimum salary cannot exceed maximum salary';
    }

    if (formData.applicationDeadline) {
      const deadline = new Date(formData.applicationDeadline);
      if (deadline < new Date()) {
        newErrors.applicationDeadline = 'Deadline cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleAddSkill = (skill) => {
    if (skill.trim() && !formData.requiredSkills.includes(skill.trim())) {
      setFormData((prev) => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, skill.trim()],
      }));
    }
  };

  const handleRemoveSkill = (index) => {
    setFormData((prev) => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter((_, i) => i !== index),
    }));
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    if (!validateForm()) {
      showToast('Please fix all errors before saving', 'error');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        jobType: formData.jobType,
        experienceLevel: formData.experienceLevel,
        salaryMin: formData.salaryMin ? Number(formData.salaryMin) : 0,
        salaryMax: formData.salaryMax ? Number(formData.salaryMax) : 0,
        currency: formData.currency,
        requiredSkills: formData.requiredSkills,
        applicationDeadline: formData.applicationDeadline || null,
        customQuestions: formData.customQuestions,
        requiredLinks: formData.requiredLinks,
        status: formData.status,
      };

      const res = await api.put(`/jobs/${id}`, payload);
      if (res.data.success) {
        setJob(res.data.job);
        setIsEditing(false);
        showToast('Job updated successfully!', 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update job', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!validateForm()) {
      showToast('Please fix all errors before publishing', 'error');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...formData,
        status: 'Active',
      };

      const res = await api.put(`/jobs/${id}`, payload);
      if (res.data.success) {
        setJob(res.data.job);
        setFormData((prev) => ({ ...prev, status: 'Active' }));
        setIsEditing(false);
        showToast('Job published successfully!', 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to publish job', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (job) {
      setFormData({
        title: job.title || '',
        location: job.location || '',
        jobType: job.jobType || 'Full-Time',
        experienceLevel: job.experienceLevel || 'Mid',
        salaryMin: job.salaryMin || '',
        salaryMax: job.salaryMax || '',
        currency: job.currency || 'USD',
        description: job.description || '',
        requiredSkills: job.requiredSkills || [],
        applicationDeadline: job.applicationDeadline
          ? job.applicationDeadline.split('T')[0]
          : '',
        customQuestions: job.customQuestions || [],
        requiredLinks: job.requiredLinks || {},
        status: job.status || 'Draft',
      });
    }
    setIsEditing(false);
    setErrors({});
    setTouched({});
  };

  if (loading) {
    return (
      <RecruiterLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading job details...</p>
          </div>
        </div>
      </RecruiterLayout>
    );
  }

  if (error || !job) {
    return (
      <RecruiterLayout>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate('/my-jobs')}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to My Jobs
          </button>
          <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900">Error</h3>
                <p className="text-red-700">{error || 'Job not found'}</p>
              </div>
            </div>
          </div>
        </div>
      </RecruiterLayout>
    );
  }

  return (
    <RecruiterLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8 px-4 sm:px-6 lg:px-8">
        {/* Toast */}
        {toast && (
          <div
            className={`fixed top-4 right-4 p-4 rounded-xl shadow-xl flex items-center gap-2 z-50 animate-in fade-in slide-in-from-top ${
              toast.type === 'success'
                ? 'bg-green-600 text-white border border-green-700'
                : 'bg-red-600 text-white border border-red-700'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            {toast.message}
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate('/my-jobs')}
              className="flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>

            {!isEditing && (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                {job.status === 'Draft' && (
                  <button
                    onClick={handlePublish}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    Publish
                  </button>
                )}
              </div>
            )}
          </div>

          {isEditing ? (
            // Edit Mode
            <div className="space-y-6">
              {/* Title */}
              <SectionCard title="Job Title & Location">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 transition-all ${
                        errors.title && touched.title
                          ? 'border-red-500 bg-red-50'
                          : 'border-green-300 hover:border-green-400'
                      }`}
                      placeholder="e.g., Senior React Developer"
                    />
                    {errors.title && touched.title && (
                      <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 transition-all ${
                        errors.location && touched.location
                          ? 'border-red-500 bg-red-50'
                          : 'border-green-300 hover:border-green-400'
                      }`}
                      placeholder="e.g., San Francisco, CA"
                    />
                    {errors.location && touched.location && (
                      <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                    )}
                  </div>
                </div>
              </SectionCard>

              {/* Job Type & Experience */}
              <SectionCard title="Job Details">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Job Type
                    </label>
                    <select
                      name="jobType"
                      value={formData.jobType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                      <option>Full-Time</option>
                      <option>Part-Time</option>
                      <option>Contract</option>
                      <option>Internship</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Experience Level
                    </label>
                    <select
                      name="experienceLevel"
                      value={formData.experienceLevel}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                      <option>Entry</option>
                      <option>Mid</option>
                      <option>Senior</option>
                      <option>Lead</option>
                    </select>
                  </div>
                </div>
              </SectionCard>

              {/* Salary */}
              <SectionCard title="Salary Information">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Min Salary
                    </label>
                    <input
                      type="number"
                      name="salaryMin"
                      value={formData.salaryMin}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                      placeholder="50000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Max Salary
                    </label>
                    <input
                      type="number"
                      name="salaryMax"
                      value={formData.salaryMax}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                      placeholder="100000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Currency
                    </label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                      <option>USD</option>
                      <option>EUR</option>
                      <option>GBP</option>
                      <option>INR</option>
                    </select>
                  </div>
                </div>
              </SectionCard>

              {/* Description */}
              <SectionCard title="Job Description">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 transition-all resize-none ${
                      errors.description && touched.description
                        ? 'border-red-500 bg-red-50'
                        : 'border-green-300 hover:border-green-400'
                    }`}
                    rows="6"
                    placeholder="Describe the job role and responsibilities..."
                  />
                  {errors.description && touched.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                  )}
                </div>
              </SectionCard>

              {/* Skills */}
              <SectionCard title="Required Skills">
                <SkillsInput
                  skills={formData.requiredSkills}
                  onAddSkill={handleAddSkill}
                  onRemoveSkill={handleRemoveSkill}
                />
              </SectionCard>

              {/* Deadline */}
              <SectionCard title="Application Deadline">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Deadline (Optional)
                  </label>
                  <input
                    type="date"
                    name="applicationDeadline"
                    value={formData.applicationDeadline}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
              </SectionCard>

              {/* Action Buttons */}
              <div className="flex gap-4 sticky bottom-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // View Mode
            <div className="space-y-6">
              {/* Job Title Card */}
              <div className="bg-white rounded-xl shadow-md border border-green-200 p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                    <p className="text-lg text-gray-600 mt-2">
                      {job.company || job.companyName || 'Your Company'} • {job.location}
                    </p>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-bold ${
                      job.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-md border border-green-100 p-4">
                  <p className="text-sm text-gray-600 font-medium">Job Type</p>
                  <p className="text-lg font-semibold text-gray-900 mt-2">{job.jobType}</p>
                </div>
                <div className="bg-white rounded-xl shadow-md border border-green-100 p-4">
                  <p className="text-sm text-gray-600 font-medium">Experience</p>
                  <p className="text-lg font-semibold text-gray-900 mt-2">{job.experienceLevel}</p>
                </div>
                {(job.salaryMin || job.salaryMax) && (
                  <div className="bg-white rounded-xl shadow-md border border-green-100 p-4">
                    <p className="text-sm text-gray-600 font-medium">Salary</p>
                    <p className="text-lg font-semibold text-gray-900 mt-2">
                      {job.currency} {job.salaryMin}
                      {job.salaryMax && ` - ${job.currency} ${job.salaryMax}`}
                    </p>
                  </div>
                )}
                {job.applicationDeadline && (
                  <div className="bg-white rounded-xl shadow-md border border-green-100 p-4">
                    <p className="text-sm text-gray-600 font-medium">Deadline</p>
                    <p className="text-lg font-semibold text-gray-900 mt-2">
                      {new Date(job.applicationDeadline).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl shadow-md border border-green-100 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Job Description</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{job.description}</p>
              </div>

              {/* Skills */}
              {job.requiredSkills && job.requiredSkills.length > 0 && (
                <div className="bg-white rounded-xl shadow-md border border-green-100 p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Meta Info */}
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
                <p>
                  Posted on{' '}
                  {new Date(job.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </RecruiterLayout>
  );
};

export default JobDetailsEdit;
