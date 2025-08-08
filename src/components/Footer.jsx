import React from 'react';
import '../styles/footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h3>Resumio</h3>
          <p>Build professional resumes effortlessly.</p>
        </div>

        <div className="footer-links">
          <a href="#steps">How It Works</a>
          <a href="#builder">Build Resume</a>
          <a href="#testimonials">Testimonials</a>
        </div>

        <div className="footer-socials">
          <a href="https://arkyne.vercel.app/">🌐</a>
          <a href="#">𝕏</a>
          <a href="#">ⓕ</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Resumio. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
