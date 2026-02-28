const nodemailer = require('nodemailer');

let transporterPromise = null;

async function getTransporter() {
  if (transporterPromise) return transporterPromise;

  transporterPromise = (async () => {
    // If SMTP configured via env, use it
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    }

    // Otherwise create an Ethereal test account for local development
    const testAccount = await nodemailer.createTestAccount();
    const t = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.info('Using Ethereal test account for sending emails. Preview URLs will be logged.');
    return t;
  })();

  return transporterPromise;
}

async function sendResetPasswordEmail({ to, name, token }) {
  const transporter = await getTransporter();
  const resetUrl = `${process.env.FRONTEND_URL || 'https://jobhubnow.vercel.app'}/reset-password/${token}`;

  const html = `
  <div style="font-family:Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color:#0f172a;">
    <div style="max-width:680px;margin:0 auto;padding:32px;">
      <div style="background:#ffffff;border-radius:12px;padding:32px;box-shadow:0 6px 18px rgba(15,23,42,0.06);">
        <h2 style="margin:0 0 8px 0;font-size:20px;color:#0f172a">Reset your password</h2>
        <p style="margin:0 0 20px 0;color:#475569">Hi ${name || 'there'},<br/>We received a request to reset your password. Click the button below to choose a new password. This link will expire in 15 minutes.</p>

        <div style="text-align:center;margin:26px 0;">
          <a href="${resetUrl}" style="display:inline-block;padding:12px 20px;background:#059669;color:white;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px;">Reset Password</a>
        </div>

        <p style="color:#64748b;font-size:13px">If the button doesn't work, copy and paste the following link into your browser:</p>
        <p style="word-break:anywhere;color:#0f172a;font-size:13px;margin:8px 0;">${resetUrl}</p>

        <hr style="border:none;border-top:1px solid #eef2f7;margin:22px 0;" />
        <p style="color:#94a3b8;font-size:12px;margin:0">If you didn't request this, you can safely ignore this email. For help, reply to this message or contact our support.</p>
      </div>

      <div style="text-align:center;margin-top:18px;color:#94a3b8;font-size:12px">Support • JobHub Pro<br/>Need help? Email <a href="mailto:${process.env.SUPPORT_EMAIL || 'support@jobhub.example'}" style="color:#64748b">${process.env.SUPPORT_EMAIL || 'support@jobhub.example'}</a></div>
    </div>
  </div>
  `;

  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME || 'JobHub'} <${process.env.EMAIL_FROM_EMAIL || process.env.EMAIL_USER || 'no-reply@example.com'}>`,
    to,
    subject: 'Reset your JobHub password',
    html,
    text: `Reset your password: ${resetUrl}`,
  };

  console.log('[Mailer] Sending email with options:', { from: mailOptions.from, to: mailOptions.to, subject: mailOptions.subject });

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('[Mailer] Email sent successfully:', { messageId: info.messageId, response: info.response });

    // If using Ethereal (no real SMTP env provided), log preview URL
    if (!process.env.EMAIL_HOST || process.env.EMAIL_HOST.includes('ethereal')) {
      const preview = nodemailer.getTestMessageUrl(info);
      console.info('[Mailer] Preview URL:', preview);
    }

    return info;
  } catch (error) {
    console.error('[Mailer] Failed to send email:', error.message);
    console.error('[Mailer] Error details:', error);
    throw error;
  }
}

module.exports = {
  sendResetPasswordEmail,
};
