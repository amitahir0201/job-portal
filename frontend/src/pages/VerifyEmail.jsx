import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setErrorMsg('No verification token found in the link.');
        return;
      }

      try {
        const response = await api.get(`/auth/verify-email/${token}`);
        if (response.data.success) {
          // Log the user in automatically
          login(response.data.user, response.data.token);
          setStatus('success');

          // Redirect to job seeker dashboard after 2 seconds
          setTimeout(() => {
            navigate('/job-seeker', { replace: true });
          }, 2000);
        } else {
          setStatus('error');
          setErrorMsg(response.data.message || 'Verification failed.');
        }
      } catch (err) {
        setStatus('error');
        setErrorMsg(
          err.response?.data?.message ||
            'Verification link is invalid or has expired. Please register again.'
        );
      }
    };

    verify();
  }, [token, login, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card shadow-lg text-center">
          {/* VERIFYING STATE */}
          {status === 'verifying' && (
            <>
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
                    boxShadow: '0 8px 25px rgba(16,185,129,0.35)',
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      border: '4px solid white',
                      borderTop: '4px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                    }}
                  />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Verifying Your Email</h2>
              <p className="text-gray-600">Please wait while we confirm your email address…</p>
            </>
          )}

          {/* SUCCESS STATE */}
          {status === 'success' && (
            <>
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
                    fontSize: 40,
                    boxShadow: '0 8px 25px rgba(16,185,129,0.35)',
                  }}
                >
                  ✅
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Email Verified!</h2>
              <p className="text-gray-600 mb-4">
                Your email has been confirmed. Redirecting you to your dashboard…
              </p>
              <div
                style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: 12,
                  padding: '12px 16px',
                }}
              >
                <p className="text-sm text-green-700 font-medium">
                  🎉 Welcome to JobHub Pro! You're now logged in.
                </p>
              </div>
            </>
          )}

          {/* ERROR STATE */}
          {status === 'error' && (
            <>
              <div className="flex justify-center mb-6">
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 40,
                    boxShadow: '0 8px 25px rgba(239,68,68,0.35)',
                  }}
                >
                  ❌
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Verification Failed</h2>
              <p className="text-gray-600 mb-6">{errorMsg}</p>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/register')}
                  className="btn-primary w-full"
                >
                  ✨ Register Again
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-2 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Back to Login
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Inline spin keyframe */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default VerifyEmail;
