const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendResetPasswordEmail({ to, name, token }) {
  const resetUrl = `${process.env.FRONTEND_URL || "https://jobhubnow.vercel.app"}/reset-password/${token}`;

  try {
    console.log("🚀 Sending email via Resend...");

    const response = await resend.emails.send({
      from: "JobHub <onboarding@resend.dev>", // default testing sender
      to,
      subject: "Reset your JobHub password",
      html: `
        <h2>Reset your password</h2>
        <p>Hi ${name || "there"},</p>
        <p>Click below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
      `,
    });

    console.log("✅ Email sent:", response);

    return response;

  } catch (error) {
    console.error("❌ Email failed:", error);
    throw error;
  }
}

module.exports = {
  sendResetPasswordEmail,
};