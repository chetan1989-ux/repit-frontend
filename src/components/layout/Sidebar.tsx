
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

const Sidebar: React.FC = () => {
  const { user } = useUser();

  return (
    <aside className="sidebar">
      <nav>
        <h3>Discover</h3>
        <ul className="nav-section">
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/explore">Explore</NavLink></li>
          <li><NavLink to="/search">Search</NavLink></li>
          <li><NavLink to="/notifications">Notifications</NavLink></li>
        </ul>
        
        <h3>My Content</h3>
        <ul className="nav-section">
          <li><NavLink to="/create">Create New</NavLink></li>
          <li><NavLink to="/my-posts">My Posts</NavLink></li>
          <li><NavLink to="/drafts">Drafts</NavLink></li>
          <li><NavLink to="/analytics">Analytics</NavLink></li>
        </ul>
        
        <h3>My Subscriptions</h3>
        <ul className="nav-section">
          <li><NavLink to="/subscriptions">Subscribed Creators</NavLink></li>
          <li><NavLink to="/saved">Saved Content</NavLink></li>
        </ul>
        
        <h3>Account</h3>
        <ul className="nav-section">
          <li><NavLink to="/profile">Profile Settings</NavLink></li>
          <li><NavLink to="/payment-methods">Payment Methods</NavLink></li>
          <li><NavLink to="/earnings">Earnings & Payouts</NavLink></li>
        </ul>
        
        {user?.isAdmin && (
          <>
            <h3>Admin</h3>
            <ul className="nav-section admin-nav">
              <li><NavLink to="/admin/users">User Management</NavLink></li>
              <li><NavLink to="/admin/moderation">Content Moderation</NavLink></li>
              <li><NavLink to="/admin/analytics">Platform Analytics</NavLink></li>
              <li><NavLink to="/admin/revenue">Revenue Reports</NavLink></li>
            </ul>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
