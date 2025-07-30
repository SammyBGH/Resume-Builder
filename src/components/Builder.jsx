import React, { useState } from 'react';
import Form from './Form';
import ResumePreview from './ResumePreview';
import '../styles/builder.css';

function Builder() {
  const [resumeData, setResumeData] = useState(null);

  return (
    <section id="builder" className="builder-section">
      <h2>Build Your Resume Now</h2>
      <div className="builder-container">
        <Form onSubmit={setResumeData} />
        <ResumePreview data={resumeData} />
      </div>
    </section>
  );
}

export default Builder;
