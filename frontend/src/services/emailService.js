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
 */
export const sendResetPasswordEmail = async (userEmail, userName, resetLink) => {
  try {
    if (!userEmail || !userName || !resetLink) {
      throw new Error('Missing required parameters: userEmail, userName, or resetLink');
    }

    const { serviceId, templateId, publicKey } = validateEmailJSConfig();

    const templateParams = {
      to_email: userEmail,
      user_name: userName,
      reset_link: resetLink,
    };

    const response = await emailjs.send(serviceId, templateId, templateParams, publicKey);
    console.log('[EmailJS] Reset email sent successfully', { status: response.status });
    return { success: true, message: 'Reset email sent successfully', response };
  } catch (error) {
    console.error('[EmailJS] Error sending reset email:', error?.text || error?.message || error);
    return { success: false, message: error?.text || error?.message || 'Failed to send reset email', error };
  }
};

/**
 * Send email verification link via EmailJS
 * Uses a separate template: VITE_EMAILJS_VERIFY_TEMPLATE_ID
 * Template must have {{to_email}}, {{user_name}}, {{verify_link}} variables
 */
export const sendVerificationEmail = async (userEmail, userName, verifyLink) => {
  try {
    if (!userEmail || !userName || !verifyLink) {
      throw new Error('Missing required parameters: userEmail, userName, or verifyLink');
    }

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    const templateId = import.meta.env.VITE_EMAILJS_VERIFY_TEMPLATE_ID;

    if (!serviceId || !publicKey) {
      throw new Error('❌ EmailJS service credentials missing in .env file');
    }
    if (!templateId || templateId.includes('xxxxx')) {
      throw new Error('❌ VITE_EMAILJS_VERIFY_TEMPLATE_ID is missing or invalid. Add it to your .env file');
    }

    console.log('[EmailJS] Sending verification email to:', userEmail);

    const templateParams = {
      to_email: userEmail,
      user_name: userName,
      verify_link: verifyLink,
    };

    const response = await emailjs.send(serviceId, templateId, templateParams, publicKey);
    console.log('[EmailJS] Verification email sent successfully', { status: response.status });
    return { success: true, message: 'Verification email sent successfully', response };
  } catch (error) {
    console.error('[EmailJS] Error sending verification email:', error?.text || error?.message || error);
    return { success: false, message: error?.text || error?.message || 'Failed to send verification email', error };
  }
};

/**
 * Send recruiter invitation email via EmailJS
 */
export const sendRecruiterInvitationEmail = async (recruiterEmail, recruiterName, resetLink) => {
  try {
    if (!recruiterEmail || !recruiterName || !resetLink) {
      throw new Error('Missing required parameters: recruiterEmail, recruiterName, or resetLink');
    }

    const { serviceId, templateId, publicKey } = validateEmailJSConfig();

    const templateParams = {
      to_email: recruiterEmail,
      user_name: recruiterName,
      reset_link: resetLink,
      email_type: 'recruiter_invitation',
    };

    const response = await emailjs.send(serviceId, templateId, templateParams, publicKey);
    console.log('[EmailJS] Recruiter invitation email sent successfully', { status: response.status });
    return { success: true, message: 'Invitation email sent successfully', response };
  } catch (error) {
    console.error('[EmailJS] Error sending recruiter invitation:', error?.text || error?.message || error);
    return { success: false, message: error?.text || error?.message || 'Failed to send invitation email', error };
  }
};

export default {
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendRecruiterInvitationEmail,
};
