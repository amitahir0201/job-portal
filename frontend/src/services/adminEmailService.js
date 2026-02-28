/**
 * Admin Email Utilities
 * Used by admin components to send emails via EmailJS
 */

import { sendRecruiterInvitationEmail } from './emailService';

/**
 * Send recruiter invitation after admin creates recruiter
 * @param {Object} emailData - Data returned from createRecruiter API
 * @returns {Promise} - Result of email sending
 */
export const sendRecruiterInvitation = async (emailData) => {
  try {
    if (!emailData || !emailData.to_email || !emailData.user_name || !emailData.reset_link) {
      throw new Error('Invalid email data. Missing to_email, user_name, or reset_link');
    }

    console.log('[AdminEmail] Sending recruiter invitation to:', emailData.to_email);

    // Use the EmailJS service to send the invitation
    const result = await sendRecruiterInvitationEmail(
      emailData.to_email,     // recruiter's email
      emailData.user_name,    // recruiter's name
      emailData.reset_link    // password setup link
    );

    if (!result.success) {
      throw new Error(result.message);
    }

    console.log('[AdminEmail] Recruiter invitation sent successfully');
    return {
      success: true,
      message: 'Invitation email sent to recruiter',
      result,
    };
  } catch (error) {
    console.error('[AdminEmail] Error sending recruiter invitation:', {
      message: error.message,
      error,
    });

    return {
      success: false,
      message: error.message || 'Failed to send invitation email',
      error,
    };
  }
};

export default {
  sendRecruiterInvitation,
};
