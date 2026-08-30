import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProfileProvider } from './contexts/ProfileContext';
import { ProtectedRoute } from './components';
import {
  Landing,
  Login,
  Register,
  ForgotPassword,
  OTPVerification,
  Onboarding,
  LifeEvents,
  EligibilityProfile,
  Dashboard,
  MyBenefits,
  SchemeDetails,
  FindBenefits,
  Documents,
  Applications,
  SavedSchemes,
  Help,
  Profile,
  NotFound
} from './pages';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProfileProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<OTPVerification />} />

            {/* Onboarding Routes */}
            <Route
              path="/app/onboarding"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/life-events"
              element={
                <ProtectedRoute>
                  <LifeEvents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/eligibility-profile"
              element={
                <ProtectedRoute>
                  <EligibilityProfile />
                </ProtectedRoute>
              }
            />

            {/* App Routes */}
            <Route
              path="/app/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/my-benefits"
              element={
                <ProtectedRoute>
                  <MyBenefits />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/schemes/:id"
              element={
                <ProtectedRoute>
                  <SchemeDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/find-benefits"
              element={
                <ProtectedRoute>
                  <FindBenefits />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/documents"
              element={
                <ProtectedRoute>
                  <Documents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/applications"
              element={
                <ProtectedRoute>
                  <Applications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/saved"
              element={
                <ProtectedRoute>
                  <SavedSchemes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/help"
              element={
                <ProtectedRoute>
                  <Help />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Catch all - 404 */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </ProfileProvider>
      </AuthProvider>
    </Router>
  );
}

export default App
