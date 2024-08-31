import React from 'react';
import './css/Navbar.css';

const Navbar = ({ onToggleSidebar,isSidebarOpen,isOpen }) => {
    const username = localStorage.getItem('username');
    
    return (
    <nav className="navbar">
      <div className="navbar-brand">
        <button className={`sidebar-toggle ${isOpen ? 'openn' : ''}`} onClick={onToggleSidebar}>
          {isSidebarOpen ? '☰' : '☰'}
        </button>
        <span>Welcome, {username}</span>
      </div>
      <div className="navbar-actions">
        <div className="navbar-user">
          <img src="C:/Users/kaiva/Desktop/New folder/drug-inventory/src/components/149071.png" alt="Profile" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
