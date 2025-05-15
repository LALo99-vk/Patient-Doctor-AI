import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// UI Components
import Layout from './components/ui/Layout';

// Auth Components
import LoginForm from './components/auth/LoginForm';

// Doctor Components
import DoctorDashboard from './components/doctor/DoctorDashboard';
import PatientList from './components/doctor/PatientList';
import ConsultationForm from './components/doctor/ConsultationForm';

// Patient Components
import PatientDashboard from './components/patient/PatientDashboard';

// Common Components
import EmergencyChat from './components/common/EmergencyChat';
import FirstAidPage from './components/common/FirstAid';

// Protected Route Component
const ProtectedRoute: React.FC<{
  element: React.ReactElement;
  allowedRoles?: ('doctor' | 'patient')[];
}> = ({ element, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }
  
  return element;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginForm />} />
          
          {/* Doctor Routes */}
          <Route
            path="/doctor/dashboard"
            element={
              <ProtectedRoute
                element={
                  <Layout title="Doctor Dashboard">
                    <DoctorDashboard />
                  </Layout>
                }
                allowedRoles={['doctor']}
              />
            }
          />
          
          <Route
            path="/doctor/patients"
            element={
              <ProtectedRoute
                element={
                  <Layout title="Patient Management">
                    <PatientList />
                  </Layout>
                }
                allowedRoles={['doctor']}
              />
            }
          />
          
          <Route
            path="/doctor/consultations/new"
            element={
              <ProtectedRoute
                element={
                  <Layout title="New Consultation">
                    <ConsultationForm />
                  </Layout>
                }
                allowedRoles={['doctor']}
              />
            }
          />
          
          {/* Patient Routes */}
          <Route
            path="/patient/dashboard"
            element={
              <ProtectedRoute
                element={
                  <Layout title="Patient Dashboard">
                    <PatientDashboard />
                  </Layout>
                }
                allowedRoles={['patient']}
              />
            }
          />
          
          {/* Common Routes */}
          <Route
            path="/emergency-chat"
            element={
              <ProtectedRoute
                element={
                  <Layout title="Emergency Chat">
                    <EmergencyChat />
                  </Layout>
                }
              />
            }
          />
          
          <Route
            path="/first-aid"
            element={
              <ProtectedRoute
                element={
                  <Layout title="First Aid Guide">
                    <FirstAidPage />
                  </Layout>
                }
              />
            }
          />
          
          {/* Redirect Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;