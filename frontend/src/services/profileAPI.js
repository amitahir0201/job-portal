import api from './api';

const normalizeRecruiterProfile = (profile) => {
  if (!profile) return profile;
  return {
    ...profile,
    profileCompletionPercentage: profile.profileCompletionPercentage || 0,
    designation: profile.designation || profile.headline || 'HR Manager',
    bio: profile.bio || profile.summary || '',
    linkedinLink: profile.linkedinLink || profile.linkedinUrl || '',
  };
};

// Recruiter Profile APIs
export const recruiterProfileAPI = {
  // Get recruiter profile
  getProfile: async () => {
    const response = await api.get('/profile');
    const payload = response.data || {};
    const profile = normalizeRecruiterProfile(payload.profile || payload.data || null);
    return {
      ...payload,
      data: profile,
    };
  },

  // Update recruiter profile
  updateProfile: async (formData) => {
    const response = await api.put('/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const payload = response.data || {};
    const profile = normalizeRecruiterProfile(payload.profile || payload.data || null);
    return {
      ...payload,
      data: profile,
    };
  },
};

// Company Profile APIs
export const companyProfileAPI = {
  // Get company profile
  getProfile: async () => {
    const response = await api.get('/profile/company');
    return response.data;
  },

  // Create company profile
  createProfile: async (data) => {
    const response = await api.post('/profile/company', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update company profile
  updateProfile: async (formData) => {
    return await companyProfileAPI.createProfile(formData);
  },
};
