import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/Sidebar.css';

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication token
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.reload(); 
    // Redirect to login page
    navigate('/');
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h2>DISTS</h2>
      </div>
      <ul className="sidebar-menu">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/hospital">Hospitals</Link></li>
        <li><Link to="/supplier">Suppliers</Link></li>
        <li><Link to="/drugs">Drugs</Link></li>
        <li><Link to="/orders">Orders</Link></li>
        <li><Link to="/patient">Patient</Link></li>
        <li><Link to="/users">Users</Link></li>
        <li><Link to="/reports">Reports</Link></li>
      </ul>
      <div className="sidebar-logout">
        <button onClick={handleLogout} className="logout-button" refresh="true">Logout</button>
      </div>
    </div>
  );
};

export default Sidebar;
