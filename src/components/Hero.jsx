import React from "react";
import "../styles/hero.css";

const Hero = () => {
  const scrollToSteps = () => {
    const section = document.getElementById("steps");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="hero-container">
      <div className="hero-card">
        <img src="/favicon.svg" alt="Resumio Logo" width="90" />
        <h1 className="hero-title">Your career. Your resume. Built beautifully.</h1>
        <p className="hero-subtext">
          Resumio helps you create a professional, standout resume in minutes with a
          simple, step-by-step form-based experience.
        </p>
        <button className="hero-btn" onClick={scrollToSteps}>
          Start Building
        </button>
      </div>
    </div>
  );
};

export default Hero;
