import React, { useState, useRef, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const UserProfile = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { userEmail, logout } = useContext(AuthContext);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleProfileClick = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    window.location.href = '/';
  };

  return (
    <div className="user-profile" ref={dropdownRef}>
      <img
        src="/img/default-user.png"
        alt="User Profile"
        className="user-avatar"
        onClick={handleProfileClick}
      />

      <div 
        className="user-dropdown" 
        style={{ display: showDropdown ? 'block' : 'none' }}
      >
        <div className="dropdown-header">
          <span>{userEmail}</span>
        </div>
        <div className="dropdown-divider"></div>
        <a href="#" className="dropdown-item">
          <i className="fas fa-user"></i> Profile
        </a>
        <a href="#" className="dropdown-item">
          <i className="fas fa-cog"></i> Settings
        </a>
        <div className="dropdown-divider"></div>
        <a href="#" className="dropdown-item" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Logout
        </a>
      </div>
    </div>
  );
};

export default UserProfile;