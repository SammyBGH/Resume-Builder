// src/components/Builder.jsx
import React, { useState, useEffect, useRef } from 'react';
import Form from './Form';
import ResumePreview from './ResumePreview';
import Modal from './Modal';
import '../styles/builder.css';

function Builder() {
  const [resumeData, setResumeData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const modalRef = useRef(null);

  // ✅ Handle form submission and open preview modal
  const handleFormSubmit = (data) => {
    setResumeData(data);
    setShowPreview(true);
  };

  // ✅ Close modal and allow editing
  const handleClosePreview = () => {
    setShowPreview(false);
  };

  // ✅ Auto-scroll to modal when it opens
  useEffect(() => {
    if (showPreview && modalRef.current) {
      modalRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showPreview]);

  return (
    <section id="builder" className="builder-section">
      <h2>Build Your Resume Now</h2>
      <div className="builder-container">
        <Form onSubmit={handleFormSubmit} />

        {/* ✅ Resume Preview inside Modal */}
        <div ref={modalRef}>
          <Modal isOpen={showPreview} onClose={handleClosePreview}>
            <ResumePreview data={resumeData} onClose={handleClosePreview} />
          </Modal>
        </div>
      </div>
    </section>
  );
}

export default Builder;
