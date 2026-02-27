import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import SeekerLayout from '../layouts/SeekerLayout';
import api from '../services/api';
import BasicInfoForm from '../components/profile/forms/BasicInfoForm';
import AboutForm from '../components/profile/forms/AboutForm';
import SkillsForm from '../components/profile/forms/SkillsForm';
import ExperienceForm from '../components/profile/forms/ExperienceForm';
import EducationForm from '../components/profile/forms/EducationForm';
import CertificationsForm from '../components/profile/forms/CertificationsForm';
import ProfessionalLinksForm from '../components/profile/forms/ProfessionalLinksForm';
import ResumeUploadForm from '../components/profile/forms/ResumeUploadForm';

const SeekerEditProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/profile');
      if (res.data.success) {
        setProfile(res.data.profile || res.data.data);
        setError('');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (updatedData) => {
    try {
      setSubmitting(true);
      const res = await api.put('/profile', updatedData);
      if (res.data.success) {
        setProfile(res.data.profile || res.data.data);
        setSuccess('Profile updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SeekerLayout>
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <Loader className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading profile...</p>
            </div>
          </div>
        </div>
      </SeekerLayout>
    );
  }

  if (error && !profile) {
    return (
      <SeekerLayout>
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="flex items-start gap-4 p-6 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-red-900">Error Loading Profile</h3>
              <p className="text-red-700 mt-1">{error}</p>
              <button
                onClick={() => fetchProfile()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </SeekerLayout>
    );
  }

  if (!profile) {
    return (
      <SeekerLayout>
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="text-center py-12">
            <p className="text-gray-600">No profile data found</p>
          </div>
        </div>
      </SeekerLayout>
    );
  }

  return (
    <SeekerLayout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold transition"
          >
            <ArrowLeft size={20} />
            Back to Profile
          </button>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Profile</h1>

        {/* Success Message */}
        {success && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <p className="text-green-800 font-semibold">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 flex items-start gap-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Form Sections */}
        <div className="space-y-6">
          <BasicInfoForm profile={profile} onUpdate={handleUpdateProfile} submitting={submitting} />
          <AboutForm profile={profile} onUpdate={handleUpdateProfile} submitting={submitting} />
          <SkillsForm profile={profile} onUpdate={handleUpdateProfile} submitting={submitting} />
          <ExperienceForm profile={profile} onUpdate={handleUpdateProfile} submitting={submitting} />
          <EducationForm profile={profile} onUpdate={handleUpdateProfile} submitting={submitting} />
          <CertificationsForm profile={profile} onUpdate={handleUpdateProfile} submitting={submitting} />
          <ProfessionalLinksForm profile={profile} onUpdate={handleUpdateProfile} submitting={submitting} />
          <ResumeUploadForm profile={profile} onUpdate={handleUpdateProfile} submitting={submitting} />
        </div>
      </div>
    </SeekerLayout>
  );
};

export default SeekerEditProfile;
