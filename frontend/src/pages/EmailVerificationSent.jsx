import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { sendVerificationEmail } from '../services/emailService';

const EmailVerificationSent = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const email = state?.email || 'your email';
  const name = state?.name || 'there';
  const verifyUrl = state?.verifyUrl || '';

  const handleResend = async () => {
    if (!verifyUrl) {
      setResendMessage('Unable to resend — please register again.');
      return;
    }
    setResending(true);
    setResendMessage('');
    try {
      const result = await sendVerificationEmail(email, name, verifyUrl);
      if (result.success) {
        setResendMessage('✅ Verification email sent again! Check your inbox.');
      } else {
        setResendMessage(`❌ ${result.message}`);
      }
    } catch {
      setResendMessage('❌ Failed to resend email. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card shadow-lg text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 36,
                boxShadow: '0 8px 25px rgba(16,185,129,0.35)',
              }}
            >
              📧
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Check Your Email!</h2>
          <p className="text-gray-600 mb-6">
            We've sent a verification link to{' '}
            <span className="font-semibold text-green-700">{email}</span>
          </p>

          {/* Steps */}
          <div
            style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: 12,
              padding: '20px 24px',
              marginBottom: 24,
              textAlign: 'left',
            }}
          >
            <p className="text-sm font-semibold text-green-800 mb-3">What to do next:</p>
            <ol className="text-sm text-green-700 space-y-2 list-decimal list-inside">
              <li>Open your email inbox</li>
              <li>Find the email from <strong>JobHub Pro</strong></li>
              <li>Click the <strong>"Verify My Email"</strong> button</li>
              <li>You'll be automatically logged in!</li>
            </ol>
          </div>

          {/* Spam note */}
          <p className="text-xs text-gray-500 mb-6">
            Don't see it? Check your <strong>spam / junk</strong> folder.
          </p>

          {/* Resend Message */}
          {resendMessage && (
            <p
              className="text-sm mb-4 font-medium"
              style={{ color: resendMessage.startsWith('✅') ? '#059669' : '#dc2626' }}
            >
              {resendMessage}
            </p>
          )}

          {/* Resend Button */}
          <button
            onClick={handleResend}
            disabled={resending}
            className="btn-primary w-full mb-4"
            style={{ opacity: resending ? 0.7 : 1 }}
          >
            {resending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Resending...
              </>
            ) : (
              '🔁 Resend Verification Email'
            )}
          </button>

          {/* Back to login */}
          <p className="text-sm text-gray-500">
            Already verified?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-green-600 font-semibold hover:text-green-700"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationSent;
