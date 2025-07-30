import React from 'react';
import '../styles/header.css';

function Header() {
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
        <a href="#builder" className="header-btn">Get Started</a>
      </div>
    </header>
  );
}

export default Header;
