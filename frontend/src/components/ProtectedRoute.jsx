import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Normalize roles: treat 'seeker' (backend) and 'jobseeker' (frontend) as equivalent
  const normalizeRole = (role) => {
    if (role === 'seeker' || role === 'jobseeker') {
      return 'jobseeker';
    }
    return role;
  };

  const userNormalizedRole = normalizeRole(user?.role);
  const requiredNormalizedRole = normalizeRole(requiredRole);

  if (requiredNormalizedRole && userNormalizedRole !== requiredNormalizedRole) {
    // Redirect to appropriate dashboard based on user role to prevent circular redirects
    if (userNormalizedRole === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (userNormalizedRole === 'recruiter') {
      return <Navigate to="/recruiter" replace />;
    } else if (userNormalizedRole === 'jobseeker') {
      return <Navigate to="/job-seeker" replace />;
    }
    // Fallback to home if role is unknown
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
