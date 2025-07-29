import React from 'react';
import '../styles/Summary.css';

function Summary({ summary }) {
  return (
    <div className="summary-container">
      <h2 className="summary-heading">Resume Summary</h2>
      <p className="summary-text">{summary}</p>
    </div>
  );
}

export default Summary;
