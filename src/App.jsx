import React, { useState } from 'react';
import Form from './components/Form';
import ResumePreview from './components/ResumePreview';
import './styles/App.css';

function App() {
  const [resumeData, setResumeData] = useState(null);

  return (
    <div className="app-container">
      <h1>Student Resume Builder</h1>
      <Form onSubmit={setResumeData} />
      <ResumePreview data={resumeData} />
    </div>
  );
}

export default App;
