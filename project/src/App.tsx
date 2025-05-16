import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

// UI Components
import Layout from './components/ui/Layout';

// Auth Components
import Login from './components/auth/Login';

// Doctor Components
import DoctorDashboard from './components/doctor/DoctorDashboard';
import PatientList from './components/doctor/PatientList';
import ConsultationForm from './components/doctor/ConsultationForm';
import DoctorSchedule from './components/doctor/DoctorSchedule';
import Consultations from './components/doctor/Consultations';
import PatientDetails from './components/doctor/PatientDetails';

// Patient Components
import PatientDashboard from './components/patient/PatientDashboard';
import Appointments from './components/patient/Appointments';
import Prescriptions from './components/patient/Prescriptions';
import Profile from './components/patient/Profile';
import SmartPrescription from './components/patient/SmartPrescription';
import FamilyAccess from './components/patient/FamilyAccess';
import AIImageAnalysis from './components/patient/AIImageAnalysis';

// Common Components
import EmergencyChat from './components/common/EmergencyChat';
import FirstAidPage from './components/common/FirstAid';
import Settings from './components/common/Settings';

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
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            
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
              path="/doctor/patients/:id"
              element={
                <ProtectedRoute
                  element={
                    <Layout title="Patient Details">
                      <PatientDetails />
                    </Layout>
                  }
                  allowedRoles={['doctor']}
                />
              }
            />
            
            <Route
              path="/doctor/schedule"
              element={
                <ProtectedRoute
                  element={
                    <Layout title="Schedule">
                      <DoctorSchedule />
                    </Layout>
                  }
                  allowedRoles={['doctor']}
                />
              }
            />
            
            <Route
              path="/doctor/consultations"
              element={
                <ProtectedRoute
                  element={
                    <Layout title="Consultations">
                      <Consultations />
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
            
            <Route
              path="/doctor/consultations/:id"
              element={
                <ProtectedRoute
                  element={
                    <Layout title="View Consultation">
                      <ConsultationForm />
                    </Layout>
                  }
                  allowedRoles={['doctor']}
                />
              }
            />
            
            <Route
              path="/doctor/consultations/:id/edit"
              element={
                <ProtectedRoute
                  element={
                    <Layout title="Edit Consultation">
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

            <Route
              path="/patient/appointments"
              element={
                <ProtectedRoute
                  element={
                    <Layout title="Appointments">
                      <Appointments />
                    </Layout>
                  }
                  allowedRoles={['patient']}
                />
              }
            />

            <Route
              path="/patient/prescriptions"
              element={
                <ProtectedRoute
                  element={
                    <Layout title="Prescriptions">
                      <Prescriptions />
                    </Layout>
                  }
                  allowedRoles={['patient']}
                />
              }
            />

            <Route
              path="/patient/profile"
              element={
                <ProtectedRoute
                  element={
                    <Layout title="Profile">
                      <Profile />
                    </Layout>
                  }
                  allowedRoles={['patient']}
                />
              }
            />

            <Route
              path="/patient/smart-prescription"
              element={
                <ProtectedRoute
                  element={
                    <Layout title="Smart Prescription Generator">
                      <SmartPrescription />
                    </Layout>
                  }
                  allowedRoles={['patient']}
                />
              }
            />

            <Route
              path="/patient/family-access"
              element={
                <ProtectedRoute
                  element={
                    <Layout title="Family Access">
                      <FamilyAccess />
                    </Layout>
                  }
                  allowedRoles={['patient']}
                />
              }
            />

            <Route
              path="/patient/ai-image-analysis"
              element={
                <ProtectedRoute
                  element={
                    <Layout title="AI Image Analysis">
                      <AIImageAnalysis />
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

            <Route
              path="/settings"
              element={
                <ProtectedRoute
                  element={
                    <Layout title="Settings">
                      <Settings />
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
    </LanguageProvider>
  );
};

export default App;