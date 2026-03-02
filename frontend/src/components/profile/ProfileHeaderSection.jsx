import React from 'react';
import { Mail, Phone, MapPin, Download, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getFullImageUrl } from '../../utils/imageUtils';

const ProfileHeaderSection = ({ profile }) => {
  const navigate = useNavigate();
  const profilePhotoUrl = getFullImageUrl(profile.profilePhoto);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Banner */}
      <div className="h-32 bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
 
      {/* Profile Info */}
      <div className="px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between">
          {/* Profile Photo & Basic Info */}
          <div className="flex flex-col md:flex-row md:items-end gap-6 mb-6 md:mb-0">
            {/* Profile Photo */}
            <div className="relative -mt-16 mb-4 md:mb-0">
              {profilePhotoUrl ? (
                <img
                  src={profilePhotoUrl}
                  alt={profile.fullName}
                  className="w-32 h-32 rounded-full border-4 border-white object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-emerald-100 flex items-center justify-center">
                  <span className="text-4xl font-bold text-emerald-600">
                    {profile.fullName?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Name & Headline */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {profile.fullName}
              </h1>
              {profile.headline && (
                <p className="text-lg text-emerald-600 font-semibold mt-1">
                  {profile.headline}
                </p>
              )}
              {profile.experienceLevel && (
                <div className="mt-3">
                  <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold">
                    {profile.experienceLevel}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/profile/edit')}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold"
            >
              <Edit2 size={18} />
              Edit
            </button>
            {getFullImageUrl(profile.resumeURL) && (
              <a
                href={getFullImageUrl(profile.resumeURL)}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-emerald-600 hover:text-emerald-600 transition font-semibold"
              >
                <Download size={18} />
                Resume
              </a>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {profile.location && (
              <div className="flex items-center gap-3">
                <MapPin className="text-emerald-600" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="text-gray-900 font-semibold">{profile.location}</p>
                </div>
              </div>
            )}
            {profile.email && (
              <div className="flex items-center gap-3">
                <Mail className="text-emerald-600" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-emerald-600 font-semibold hover:underline truncate"
                  >
                    {profile.email}
                  </a>
                </div>
              </div>
            )}
            {profile.phone && (
              <div className="flex items-center gap-3">
                <Phone className="text-emerald-600" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <a
                    href={`tel:${profile.phone}`}
                    className="text-emerald-600 font-semibold hover:underline"
                  >
                    {profile.phone}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeaderSection;
