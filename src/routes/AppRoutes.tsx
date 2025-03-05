
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import HomePage from '../pages/HomePage';
import CreateContentPage from '../pages/CreateContentPage';
import SignupPage from '../pages/SignupPage';
import VerifyEmailPage from '../pages/VerifyEmailPage';
import OnboardingPage from '../pages/OnboardingPage';
import LoginPage from '../pages/LoginPage';
import ErrorPage from '../pages/ErrorPage';
import { useUser } from '../contexts/UserContext';

const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { isAuthenticated } = useUser();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{element}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<SignupPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/error" element={<ErrorPage />} />
      
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<HomePage />} />
        <Route path="explore" element={<div>Explore Page (to be implemented)</div>} />
        <Route path="search" element={<div>Search Page (to be implemented)</div>} />
        <Route path="create" element={<ProtectedRoute element={<CreateContentPage />} />} />
        <Route path="my-posts" element={<ProtectedRoute element={<div>My Posts (to be implemented)</div>} />} />
        
        {/* More routes will be added as we implement more pages */}
      </Route>
      
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default AppRoutes;
