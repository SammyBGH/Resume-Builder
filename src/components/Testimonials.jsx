import React from 'react';
import '../styles/Testimonials.css';

function Testimonials() {
  return (
    <section className="testimonials-section" id='testimonials'>
      <h2>Trusted by Job Seekers Worldwide 🌍</h2>
      <div className="testimonials-container">
        <div className="testimonial-card">
          <p>"Resumio made building my resume effortless and professional-looking in minutes."</p>
          <h4>– Sarah J.</h4>
        </div>
        <div className="testimonial-card">
          <p>"I landed 3 interviews within a week thanks to my improved resume!"</p>
          <h4>– Mark D.</h4>
        </div>
        <div className="testimonial-card">
          <p>"The step-by-step form makes resume building so easy. Highly recommend!"</p>
          <h4>– Priya S.</h4>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
