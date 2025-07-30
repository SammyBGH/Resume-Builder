import React from 'react';
import '../styles/Steps.css';

function Steps() {
  return (
    <section id="steps" className="steps-section">
      <h2>Build Your Resume in 3 Easy Steps</h2>
      <div className="steps-container">
        <div className="step-card">
          <span>1️⃣</span>
          <h3>Fill in Your Details</h3>
          <p>Answer simple, guided questions to capture your career information.</p>
        </div>
        <div className="step-card">
          <span>2️⃣</span>
          <h3>Choose a Template</h3>
          <p>Select from multiple clean, professional resume templates.</p>
        </div>
        <div className="step-card">
          <span>3️⃣</span>
          <h3>Download & Apply</h3>
          <p>Download your polished resume and make your job application shine.</p>
        </div>
      </div>
    </section>
  );
}

export default Steps;
