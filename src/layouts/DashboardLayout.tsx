
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';

export const DashboardLayout: React.FC = () => {
  const { isAuthenticated } = useUser();

  if (!isAuthenticated) {
    return <div>Please login to access the dashboard</div>;
  }

  return (
    <div className="dashboard-layout">
      <Header />
      <div className="dashboard-container">
        <Sidebar />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
