import React, { useRef, useState, useEffect } from "react";
import html2pdf from "html2pdf.js";
import axios from "axios";
import "../styles/ResumePreview.css";
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
  FaFolderOpen,
} from "react-icons/fa";

function ResumePreview({ data }) {
  const resumeRef = useRef();
  const [template, setTemplate] = useState("modern");
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [resumeId, setResumeId] = useState(null);
  const [resumeData, setResumeData] = useState(data || {});

  // ✅ API Base URL
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "https://resumio-api.onrender.com";

  // ✅ Load saved resume data on page load
  useEffect(() => {
    const savedData = localStorage.getItem("resumePreviewData");
    if (savedData) {
      setResumeData(JSON.parse(savedData));
    }
  }, []);

  // ✅ Save data whenever "data" prop changes
  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      setResumeData(data);
      localStorage.setItem("resumePreviewData", JSON.stringify(data));
    }
  }, [data]);

  // ✅ Auto-save resume on first load to ensure resumeId exists
  useEffect(() => {
    const autoSave = async () => {
      if (
        !localStorage.getItem("savedResumeId") &&
        resumeData &&
        Object.keys(resumeData).length > 0
      ) {
        await saveResume();
      }
    };
    autoSave();
  }, [resumeData]);

  // ✅ Check payment status on page refresh
  useEffect(() => {
    const checkPaymentStatus = async () => {
      const savedResumeId = localStorage.getItem("savedResumeId");
      const idToCheck = resumeId || savedResumeId;
      if (!idToCheck) return;

      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/payments/payment-status/${idToCheck}`
        );
        if (res.data.success && res.data.paid) {
          setPaymentVerified(true);
          setResumeId(idToCheck);
        }
      } catch (err) {
        console.error("Error checking payment status:", err);
      }
    };

    checkPaymentStatus();
  }, [resumeId]);

  // ✅ Save resume before payment
  const saveResume = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Please log in first.");
      return null;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/api/resumes`, resumeData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResumeId(res.data.resume._id);
      localStorage.setItem("savedResumeId", res.data.resume._id); // ✅ Save to localStorage
      return res.data.resume._id;
    } catch (err) {
      console.error("Error saving resume:", err);
      return null;
    }
  };

  // ✅ Handle Paystack Payment
  const handlePayment = async () => {
    // Check if Paystack script has fully loaded
    if (!window.PaystackPop || typeof window.PaystackPop.setup !== "function") {
      alert(
        "Payment service is still loading. Please wait a few seconds and try again."
      );
      return;
    }

    // Save or retrieve resume ID before starting payment
    const id = resumeId || (await saveResume());
    if (!id) {
      alert("Unable to save your resume. Please try again.");
      return;
    }

    try {
      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: resumeData.email || "user@example.com",
        amount: 1000, // Amount in pesewas (10 GHS = 1000 pesewas)
        currency: "GHS",
        ref: "RESUME-" + Date.now(),
        metadata: { resumeId: id },
        onClose: function () {
          alert("Payment popup closed. No charges were made.");
        },
        callback: async function (response) {
          if (!response || !response.reference) {
            alert("Payment process was interrupted. Please try again.");
            return;
          }

          try {
            // Verify payment on the backend
            const verifyRes = await axios.get(
              `${API_BASE_URL}/api/payments/verify/${response.reference}`
            );
            if (verifyRes.data.success) {
              setPaymentVerified(true);
              alert(
                "✅ Payment verified successfully! You can now download your resume."
              );
            } else {
              alert(
                "Payment completed but verification failed. Please contact support."
              );
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert(
              "Payment completed but verification check failed. Please refresh the page."
            );
          }
        },
      });

      handler.openIframe();
    } catch (error) {
      console.error("Payment setup error:", error);
      alert("Payment service encountered an error. Please try again later.");
    }
  };

  // ✅ Handle PDF download
  const downloadPDF = () => {
    const element = resumeRef.current;

    const opt = {
      margin: 0.3,
      filename: `${resumeData.fullName || "resume"}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    element.classList.add("pdf-export");
    html2pdf()
      .from(element)
      .set(opt)
      .save()
      .then(() => {
        element.classList.remove("pdf-export");
      });
  };

  if (!resumeData || Object.keys(resumeData).length === 0) return null;

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
          <h1>{resumeData.fullName}</h1>
          <div className="contact-info">
            {resumeData.phone && (
              <p>
                <FaPhone /> {resumeData.phone}
              </p>
            )}
            {resumeData.email && (
              <p>
                <FaEnvelope /> {resumeData.email}
              </p>
            )}
            {resumeData.location && (
              <p>
                <FaMapMarkerAlt /> {resumeData.location}
              </p>
            )}
            {resumeData.website && (
              <p>
                <FaGlobe /> {resumeData.website}
              </p>
            )}
          </div>
        </div>

        {/* Summary */}
        {resumeData.summary && (
          <div className="section">
            <h2>
              <FaUserAlt className="icon" /> Summary
            </h2>
            <p>{resumeData.summary}</p>
          </div>
        )}

        {/* Experience */}
        {resumeData.experience && (
          <div className="section">
            <h2>
              <FaBriefcase className="icon" /> Experience
            </h2>
            <ul>
              {resumeData.experience.split("\n").map((exp, i) => (
                <li key={i}>{exp}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Skills */}
        {resumeData.skills && resumeData.skills.length > 0 && (
          <div className="section">
            <h2>
              <FaTools className="icon" /> Skills
            </h2>
            <ul>
              {resumeData.skills.map((skill, i) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Education */}
        {(resumeData.program || resumeData.school) && (
          <div className="section">
            <h2>
              <FaGraduationCap className="icon" /> Education
            </h2>
            <p id="child1">
              {resumeData.program && <strong>{resumeData.program}</strong>}
              <br />
              {resumeData.school && (
                <span className="school-name">{resumeData.school}</span>
              )}
            </p>
          </div>
        )}

        {/* Languages */}
        {resumeData.languages && resumeData.languages.length > 0 && (
          <div className="section">
            <h2>
              <FaLanguage className="icon" /> Languages
            </h2>
            <ul>
              {resumeData.languages.map((lang, i) => (
                <li key={i}>
                  <strong>{lang.name}</strong>
                  {lang.proficiency && (
                    <span className="proficiency"> ({lang.proficiency})</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Projects */}
        {resumeData.projects && (
          <div className="section">
            <h2>
              <FaFolderOpen className="icon" /> Projects
            </h2>
            <ul>
              {resumeData.projects.split("\n").map((proj, i) => (
                <li key={i}>{proj}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Certifications */}
        {resumeData.certifications && (
          <div className="section">
            <h2>
              <FaCertificate className="icon" /> Certifications
            </h2>
            <ul>
              {resumeData.certifications.split("\n").map((cert, i) => (
                <li key={i}>{cert}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Payment or Download Button */}
      {!paymentVerified ? (
        <button className="payment-btn" onClick={handlePayment}>
          💳 Pay GHS 10 to Unlock Download
        </button>
      ) : (
        <button className="download-btn" onClick={downloadPDF}>
          <FaDownload /> Download PDF
        </button>
      )}
    </div>
  );
}

export default ResumePreview;
