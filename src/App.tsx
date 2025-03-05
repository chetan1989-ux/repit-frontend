
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import AppRoutes from './routes/AppRoutes';
import './App.css';

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </UserProvider>
  );
}
