
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import HomePage from '../pages/HomePage';
import CreateContentPage from '../pages/CreateContentPage';
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
      <Route path="/login" element={<div>Login Page (to be implemented)</div>} />
      <Route path="/register" element={<div>Register Page (to be implemented)</div>} />
      
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<HomePage />} />
        <Route path="explore" element={<div>Explore Page (to be implemented)</div>} />
        <Route path="search" element={<div>Search Page (to be implemented)</div>} />
        <Route path="create" element={<ProtectedRoute element={<CreateContentPage />} />} />
        <Route path="my-posts" element={<ProtectedRoute element={<div>My Posts (to be implemented)</div>} />} />
        
        {/* More routes will be added as we implement more pages */}
      </Route>
      
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
