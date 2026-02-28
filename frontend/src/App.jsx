import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Jobs from './pages/Jobs';
import Dashboard from './pages/Dashboard';
import PostJob from './pages/PostJob';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import JobDetails from './pages/JobDetails';
import Applicants from './pages/Applicants';
import ApplicantDetails from './pages/ApplicantDetails';
import MyJobs from './pages/MyJobs';
import Messages from './pages/Messages';
import JobSeekerMessages from './pages/JobSeekerMessages';
import Notifications from './pages/Notifications';
import SavedJobs from './pages/SavedJobs';
import MyApplications from './pages/MyApplications';
import JobSeekerProfile from './pages/JobSeekerProfile';
import SeekerProfileView from './pages/SeekerProfileView';
import SeekerEditProfile from './pages/SeekerEditProfile';
import RecruiterProfile from './pages/RecruiterProfile';
import CompanyProfile from './pages/CompanyProfile';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <Routes>
          {/* Public Routes with Navbar */}
          <Route element={<NavbarLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* JobSeeker Routes */}
          <Route
            path="/jobs"
            element={
              <ProtectedRoute requiredRole="jobseeker">
                <Jobs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/job-details/:id"
            element={
              <ProtectedRoute requiredRole="jobseeker">
                <JobDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/job-seeker"
            element={
              <ProtectedRoute requiredRole="jobseeker">
                <JobSeekerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/job-seeker-dashboard"
            element={
              <ProtectedRoute requiredRole="jobseeker">
                <JobSeekerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute requiredRole="jobseeker">
                <SeekerProfileView />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/edit"
            element={
              <ProtectedRoute requiredRole="jobseeker">
                <SeekerEditProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/saved-jobs"
            element={
              <ProtectedRoute requiredRole="jobseeker">
                <SavedJobs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/applications"
            element={
              <ProtectedRoute requiredRole="jobseeker">
                <MyApplications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />

          <Route
            path="/messages/:jobId"
            element={
              <ProtectedRoute requiredRole="jobseeker">
                <JobSeekerMessages />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />

          {/* Recruiter Routes */}
          <Route
            path="/recruiter"
            element={
              <ProtectedRoute requiredRole="recruiter">
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/post-job"
            element={
              <ProtectedRoute requiredRole="recruiter">
                <PostJob />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-jobs"
            element={
              <ProtectedRoute requiredRole="recruiter">
                <MyJobs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/applicants/:jobId"
            element={
              <ProtectedRoute requiredRole="recruiter">
                <Applicants />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recruiter/applicants/:id"
            element={
              <ProtectedRoute requiredRole="recruiter">
                <ApplicantDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recruiter/seeker/:userId"
            element={
              <ProtectedRoute requiredRole="recruiter">
                <JobSeekerProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recruiter/profile"
            element={
              <ProtectedRoute requiredRole="recruiter">
                <RecruiterProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recruiter/company-profile"
            element={
              <ProtectedRoute requiredRole="recruiter">
                <CompanyProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

// Layout Component for Public Routes
function NavbarLayout() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}

export default App;
