import React, { useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';
import '../styles/ResumePreview.css';
import { 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaGlobe, 
  FaUserAlt, 
  FaBriefcase, 
  FaTools, 
  FaGraduationCap, 
  FaLanguage,
  FaDownload,
  FaCertificate,
  FaFolderOpen
} from 'react-icons/fa';

function ResumePreview({ data }) {
  const resumeRef = useRef();
  const [template, setTemplate] = useState("modern");

  const downloadPDF = () => {
    const element = resumeRef.current;

    const opt = {
      margin: 0.3,
      filename: `${data.fullName || "resume"}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    element.classList.add("pdf-export");
    html2pdf().from(element).set(opt).save().then(() => {
      element.classList.remove("pdf-export");
    });
  };

  if (!data) return null;

  return (
    <div className="resume-preview-wrapper">
      {/* Template Selector */}
      <div className="template-selector">
        <button 
          className={template === "modern" ? "active" : ""} 
          onClick={() => setTemplate("modern")}
        >
          Modern
        </button>
        <button 
          className={template === "classic" ? "active" : ""} 
          onClick={() => setTemplate("classic")}
        >
          Classic
        </button>
        <button 
          className={template === "minimal" ? "active" : ""} 
          onClick={() => setTemplate("minimal")}
        >
          Minimal
        </button>
      </div>

      {/* Resume Preview */}
      <div className={`resume-preview template-${template}`} ref={resumeRef}>
        <div className="resume-header">
          <h1>{data.fullName}</h1>
          <div className="contact-info">
            {data.phone && <p><FaPhone /> {data.phone}</p>}
            {data.email && <p><FaEnvelope /> {data.email}</p>}
            {data.location && <p><FaMapMarkerAlt /> {data.location}</p>}
            {data.website && <p><FaGlobe /> {data.website}</p>}
          </div>
        </div>

        {/* Summary */}
        {data.summary && (
          <div className="section">
            <h2><FaUserAlt className="icon" /> Summary</h2>
            <p>{data.summary}</p>
          </div>
        )}

        {/* Experience */}
        {data.experience && (
          <div className="section">
            <h2><FaBriefcase className="icon" /> Experience</h2>
            <ul>
              {data.experience.split('\n').map((exp, i) => (
                <li key={i}>{exp}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <div className="section">
            <h2><FaTools className="icon" /> Skills</h2>
            <ul>
              {data.skills.map((skill, i) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Education */}
        {(data.program || data.school) && (
          <div className="section">
            <h2><FaGraduationCap className="icon" /> Education</h2>
            <p id='child1'>
              {data.program && <strong>{data.program}</strong>}<br />
              {data.school && <span className="school-name">{data.school}</span>}
            </p>
          </div>
        )}

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <div className="section">
            <h2><FaLanguage className="icon" /> Languages</h2>
            <ul>
              {data.languages.map((lang, i) => (
                <li key={i}>
                  <strong>{lang.name}</strong>
                  {lang.proficiency && <span className="proficiency"> ({lang.proficiency})</span>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Projects */}
        {data.projects && (
          <div className="section">
            <h2><FaFolderOpen className="icon" /> Projects</h2>
            <ul>
              {data.projects.split('\n').map((proj, i) => (
                <li key={i}>{proj}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Certifications */}
        {data.certifications && (
          <div className="section">
            <h2><FaCertificate className="icon" /> Certifications</h2>
            <ul>
              {data.certifications.split('\n').map((cert, i) => (
                <li key={i}>{cert}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Download Button */}
      <button className="download-btn" onClick={downloadPDF}>
        <FaDownload /> Download PDF
      </button>
    </div>
  );
}

export default ResumePreview;
