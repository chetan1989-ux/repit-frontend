
import React from 'react';
import { useUser } from '../../contexts/UserContext';

const Header: React.FC = () => {
  const { user, logout } = useUser();

  return (
    <header className="header">
      <div className="logo">Cloutzy</div>
      <div className="user-controls">
        {user && <span>Welcome, {user.name}</span>}
        <button onClick={logout} className="logout-button">Logout</button>
      </div>
    </header>
  );
};

export default Header;
