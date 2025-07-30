import React, { useState, useRef, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import '../styles/header.css';

function Header({ user, handleLoginSuccess, handleLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Extract initials from name
  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.split(" ");
    return parts.map(part => part[0].toUpperCase()).join("").slice(0, 2);
  };

  // Extract first name
  const getFirstName = (name) => {
    if (!name) return "";
    return name.split(" ")[0];
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <h2>Resumio</h2>
        </div>

        <nav className="header-nav">
          <a href="#steps">How It Works</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#builder">Build Resume</a>
        </nav>

        <div className="header-auth">
          {user ? (
            <div className="user-menu" ref={dropdownRef}>
              <div
                className="user-info clickable"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {user.picture && user.picture.trim() !== "" ? (
                  <img
                    src={user.picture}
                    alt="profile"
                    className="user-avatar"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="user-initials">{getInitials(user.name)}</div>
                )}
                <span className="user-firstname">{getFirstName(user.name)}</span>
                <span className={`dropdown-arrow ${dropdownOpen ? "open" : ""}`}>▼</span>
              </div>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => console.log("Google Login Failed")}
              theme="filled_blue"
              shape="pill"
              size="medium"
            />
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
