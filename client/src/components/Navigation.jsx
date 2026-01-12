import React, { useState, useEffect } from 'react';
import './Navigation.css';
import SearchModal from './SearchModal';
import { getCurrentUser, setCurrentUser } from '../services/storage';

const Navigation = ({ currentPage, onNavigate, onSearch }) => {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    setUserName(user ? user.name : null);
    // Check periodically for user changes
    const interval = setInterval(() => {
      const currentUser = getCurrentUser();
      if ((currentUser && currentUser.name) !== userName) {
        setUserName(currentUser ? currentUser.name : null);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [currentPage, userName]);

  const handleSearch = (searchTerm, categoryFilter) => {
    if (onSearch) {
      onSearch(searchTerm, categoryFilter);
    }
  };

  const navigate = (page) => {
    const user = getCurrentUser();
    const restricted = ['stock-in', 'stock-out', 'report', 'stock-out-list'];
    if (restricted.includes(page) && !user) {
      alert('You need to login first to access that page');
      return;
    }
    onNavigate(page);
  };

  return (
    <>
      <nav className="main-navigation">
        <div className="nav-brand">
          {userName ? (
            <>
              <div className="brand-circle">{userName.charAt(0).toUpperCase()}</div>
              <span className="brand-name">{userName}</span>
            </>
          ) : (
            <div className="brand-circle"></div>
          )}
        </div>
        
        <div className="nav-links">
          <button
            className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => navigate('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`nav-link ${currentPage === 'stock-in' ? 'active' : ''}`}
            onClick={() => navigate('stock-in')}
          >
            Stock In
          </button>
          <button
            className={`nav-link ${currentPage === 'stock-out' ? 'active' : ''}`}
            onClick={() => navigate('stock-out')}
          >
            Stock Out
          </button>
          <button
            className={`nav-link ${currentPage === 'report' ? 'active' : ''}`}
            onClick={() => navigate('report')}
          >
            Report
          </button>
        </div>

        <div className="nav-actions">
          <button
            className="nav-icon-btn"
            onClick={() => setShowSearchModal(true)}
            title="Search"
          >
            🔍
          </button>
          {userName ? (
            <>
              <button
                className="nav-login-btn"
                onClick={() => {
                  if (window.confirm('Logout?')) {
                    setCurrentUser(null);
                    onNavigate('dashboard');
                  }
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              className="nav-login-btn"
              onClick={() => onNavigate('login')}
            >
              Login / Sign Up
            </button>
          )}
        </div>
      </nav>
      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSearch={handleSearch}
      />
    </>
  );
};

export default Navigation;
