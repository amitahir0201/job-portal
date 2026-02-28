import api from './api';

/**
 * Real API Service for Recruiter Dashboard
 * Fetches actual data from the backend API
 */

export const dashboardAPI = {
  // Fetch recruiter's jobs
  getJobs: async () => {
    try {
      const response = await api.get('/jobs/my');
      const jobs = response.data.jobs || [];
      
      return {
        success: true,
        jobs: jobs.map(job => ({
          ...job,
          applications: job.applicationsCount || 0,
          views: job.views || 0,
          deadline: job.applicationDeadline || '',
        })),
        stats: {
          total: jobs.length,
          active: jobs.filter((j) => j.status === 'Active').length,
          draft: jobs.filter((j) => j.status === 'Draft').length,
          closed: jobs.filter((j) => j.status === 'Closed').length,
          totalApplications: jobs.reduce((sum, j) => sum + (j.applicationsCount || 0), 0),
          totalViews: jobs.reduce((sum, j) => sum + (j.views || 0), 0),
        },
      };
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return {
        success: false,
        jobs: [],
        message: error.response?.data?.message || 'Failed to fetch jobs',
      };
    }
  },

  // Fetch applicants for all jobs
  getApplicants: async () => {
    try {
      // First, get all jobs
      const jobsRes = await api.get('/jobs/my');
      const jobs = jobsRes.data.jobs || [];

      // Fetch applications for each job
      const applicantPromises = jobs.map(job =>
        api.get(`/applications/job/${job._id}`).catch(() => ({ data: { applications: [] } }))
      );

      const applicantResponses = await Promise.all(applicantPromises);
      const allApplicants = [];

      // Flatten all applications from all jobs
      applicantResponses.forEach((response, index) => {
        const applications = response.data?.applications || [];
        applications.forEach(app => {
          allApplicants.push({
            _id: app._id,
            name: app.applicant?.name || 'Unknown',
            email: app.applicant?.email || '',
            jobTitle: jobs[index]?.title || '',
            status: app.status || 'New',
            appliedDate: app.createdAt || new Date(),
            resumeUrl: app.resumeURL || '',
            jobId: jobs[index]?._id || '',
          });
        });
      });

      return {
        success: true,
        applicants: allApplicants,
        stats: {
          total: allApplicants.length,
          new: allApplicants.filter((a) => a.status === 'New').length,
          reviewed: allApplicants.filter((a) => a.status === 'Reviewed').length,
          shortlisted: allApplicants.filter((a) => a.status === 'Shortlisted').length,
          scheduled: allApplicants.filter((a) => a.status === 'Interview Scheduled').length,
          rejected: allApplicants.filter((a) => a.status === 'Rejected').length,
          hired: allApplicants.filter((a) => a.status === 'Hired').length,
        },
      };
    } catch (error) {
      console.error('Error fetching applicants:', error);
      return {
        success: false,
        applicants: [],
        message: error.response?.data?.message || 'Failed to fetch applicants',
      };
    }
  },

  // Update applicant status
  updateApplicantStatus: async (applicantId, newStatus) => {
    try {
      const response = await api.put(`/applications/${applicantId}/status`, {
        status: newStatus,
      });
      return {
        success: true,
        message: `Applicant status updated to ${newStatus}`,
        application: response.data.application,
      };
    } catch (error) {
      console.error('Error updating applicant status:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update status',
      };
    }
  },

  // Close job
  closeJob: async (jobId) => {
    try {
      const response = await api.put(`/jobs/${jobId}/status`, {
        status: 'Closed',
      });
      return {
        success: true,
        message: 'Job closed successfully',
        job: response.data.job,
      };
    } catch (error) {
      console.error('Error closing job:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to close job',
      };
    }
  },
};
