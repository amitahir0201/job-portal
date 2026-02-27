import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, AlertCircle, ArrowLeft } from 'lucide-react';
import SeekerLayout from '../layouts/SeekerLayout';
import api from '../services/api';
import ProfileHeaderSection from '../components/profile/ProfileHeaderSection';
import AboutSection from '../components/profile/AboutSection';
import SkillsSection from '../components/profile/SkillsSection';
import ExperienceSection from '../components/profile/ExperienceSection';
import EducationSection from '../components/profile/EducationSection';
import CertificationsSection from '../components/profile/CertificationsSection';
import ProfessionalLinksSection from '../components/profile/ProfessionalLinksSection';

const SeekerProfileView = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/auth/profile');
      if (res.data.success) {
        setProfile(res.data.profile);
        setError('');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
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

  if (error) {
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
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold transition"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <button
            onClick={() => navigate('/profile/edit')}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold"
          >
            Edit Profile
          </button>
        </div>

        {/* Profile Header */}
        <ProfileHeaderSection profile={profile} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            {profile.summary && <AboutSection summary={profile.summary} />}

            {/* Skills Section */}
            {profile.skills && profile.skills.length > 0 && (
              <SkillsSection skills={profile.skills} />
            )}

            {/* Experience Section */}
            {profile.workExperience && profile.workExperience.length > 0 && (
              <ExperienceSection experiences={profile.workExperience} />
            )}

            {/* Education Section */}
            {profile.education && profile.education.length > 0 && (
              <EducationSection educations={profile.education} />
            )}

            {/* Certifications Section */}
            {profile.certifications && profile.certifications.length > 0 && (
              <CertificationsSection certifications={profile.certifications} />
            )}

            {/* Professional Links Section */}
            <ProfessionalLinksSection profile={profile} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-20">
              <h3 className="font-bold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3 text-sm">
                {profile.email && (
                  <div>
                    <p className="text-gray-600 font-medium">Email</p>
                    <a
                      href={`mailto:${profile.email}`}
                      className="text-emerald-600 hover:underline break-all"
                    >
                      {profile.email}
                    </a>
                  </div>
                )}
                {profile.phone && (
                  <div>
                    <p className="text-gray-600 font-medium">Phone</p>
                    <a
                      href={`tel:${profile.phone}`}
                      className="text-emerald-600 hover:underline"
                    >
                      {profile.phone}
                    </a>
                  </div>
                )}
                {profile.location && (
                  <div>
                    <p className="text-gray-600 font-medium">Location</p>
                    <p className="text-gray-700">{profile.location}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SeekerLayout>
  );
};

export default SeekerProfileView;
