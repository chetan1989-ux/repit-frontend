
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import AppRoutes from './routes/AppRoutes';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
        </div>
      </UserProvider>
    </BrowserRouter>
  );
}
