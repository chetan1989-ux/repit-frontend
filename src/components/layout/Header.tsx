import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useUser();

  return (
    <header className="bg-white shadow-sm px-4 py-4 flex justify-between items-center">
      <div className="font-bold text-xl text-indigo-600">Content Platform</div>
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            <span className="text-gray-700">Welcome, {user?.fullName || user?.username}</span>
            <button 
              className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
              onClick={logout}
            >
              Logout
            </button>
          </>
        ) : (
          <div className="space-x-2">
            <Link 
              to="/login" 
              className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;