import emailjs from "@emailjs/browser";

// Validate EmailJS credentials
const validateEmailJSConfig = () => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || serviceId.includes('xxxxx')) {
    throw new Error('❌ VITE_EMAILJS_SERVICE_ID is missing or invalid. Add it to .env.development');
  }
  if (!templateId || templateId.includes('xxxxx')) {
    throw new Error('❌ VITE_EMAILJS_TEMPLATE_ID is missing or invalid. Add it to .env.development');
  }
  if (!publicKey || publicKey.includes('xxxxx')) {
    throw new Error('❌ VITE_EMAILJS_PUBLIC_KEY is missing or invalid. Add it to .env.development');
  }

  return { serviceId, templateId, publicKey };
};

// Initialize EmailJS with validated credentials
try {
  const { publicKey } = validateEmailJSConfig();
  emailjs.init(publicKey);
  console.log('✅ EmailJS initialized successfully');
} catch (error) {
  console.error('❌ EmailJS initialization failed:', error.message);
}

/**
 * Send password reset email via EmailJS
 * @param {string} userEmail - Recipient email address
 * @param {string} userName - Recipient name
 * @param {string} resetLink - Password reset link
 * @returns {Promise} - EmailJS response
 */
export const sendResetPasswordEmail = async (userEmail, userName, resetLink) => {
  try {
    if (!userEmail || !userName || !resetLink) {
      throw new Error('Missing required parameters: userEmail, userName, or resetLink');
    }

    // Validate EmailJS credentials before sending
    const { serviceId, templateId, publicKey } = validateEmailJSConfig();

    console.log('[EmailJS] Preparing to send password reset email', {
      to_email: userEmail,
      user_name: userName,
      service_id: serviceId,
      template_id: templateId,
    });

    // Template parameters that will be used in your EmailJS template
    const templateParams = {
      to_email: userEmail,  // 👈 IMPORTANT: This goes to {{to_email}} in your template
      user_name: userName,   // 👈 This goes to {{user_name}} in your template
      reset_link: resetLink, // 👈 This goes to {{reset_link}} in your template
    };

    console.log('[EmailJS] Template parameters:', templateParams);

    // Send email using EmailJS
    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      publicKey
    );

    console.log('[EmailJS] Email sent successfully', {
      status: response.status,
      text: response.text,
      email: userEmail,
    });

    return {
      success: true,
      message: 'Reset email sent successfully',
      response,
    };
  } catch (error) {
    console.error('[EmailJS] Error sending reset email:', {
      message: error.message,
      error,
      userEmail,
    });

    return {
      success: false,
      message: error.message || 'Failed to send reset email',
      error,
    };
  }
};

/**
 * Send recruiter invitation email via EmailJS
 * @param {string} recruiterEmail - Recruiter email address
 * @param {string} recruiterName - Recruiter name
 * @param {string} resetLink - Password setup link
 * @returns {Promise} - EmailJS response
 */
export const sendRecruiterInvitationEmail = async (recruiterEmail, recruiterName, resetLink) => {
  try {
    if (!recruiterEmail || !recruiterName || !resetLink) {
      throw new Error('Missing required parameters: recruiterEmail, recruiterName, or resetLink');
    }

    // Validate EmailJS credentials before sending
    const { serviceId, templateId, publicKey } = validateEmailJSConfig();

    console.log('[EmailJS] Preparing to send recruiter invitation email', {
      to_email: recruiterEmail,
      recruiter_name: recruiterName,
    });

    // Template parameters
    const templateParams = {
      to_email: recruiterEmail,
      user_name: recruiterName,
      reset_link: resetLink,
      email_type: 'recruiter_invitation',
    };

    // Send email using EmailJS
    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      publicKey
    );

    console.log('[EmailJS] Recruiter invitation email sent successfully', {
      status: response.status,
      text: response.text,
      email: recruiterEmail,
    });

    return {
      success: true,
      message: 'Invitation email sent successfully',
      response,
    };
  } catch (error) {
    console.error('[EmailJS] Error sending recruiter invitation:', {
      message: error.message,
      error,
      recruiterEmail,
    });

    return {
      success: false,
      message: error.message || 'Failed to send invitation email',
      error,
    };
  }
};

export default {
  sendResetPasswordEmail,
  sendRecruiterInvitationEmail,
};
