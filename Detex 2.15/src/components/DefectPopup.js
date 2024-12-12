import React, { useState } from "react";
import "./DefectPopup.css";

function DefectPopup({ defectDetails, snapshot, onSubmitFeedback, fabricType }) {
  const [feedback, setFeedback] = useState("correct");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitFeedback(feedback);
  };

  const classLabelIndex =
    defectDetails.class_labels && defectDetails.class_labels[0];
  const predictedClass = defectDetails.class_names
    ? defectDetails.class_names[classLabelIndex.toString()] || "Unknown"
    : "Unknown";

  return (
    <div className="defect-popup">
      <div className="defect-popup-content">
        <h2>Defect Detected: {predictedClass}</h2>
        <p>Fabric Type: {fabricType.charAt(0).toUpperCase() + fabricType.slice(1)}</p>
        <p>Defect Snapshot:</p>
        {snapshot ? (
          <img
            src={snapshot} // Use snapshot URL
            alt="Defect Snapshot"
            className="snapshot-image"
          />
        ) : (
          <p>No snapshot available</p>
        )}
        <form onSubmit={handleSubmit}>
          <label>
            Feedback:
            <select
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="feedback-select"
            >
              <option value="correct">Correct</option>
              <option value="to-be-reviewed">To be reviewed</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>
          <button type="submit" className="feedback-submit-btn">
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
}

export default DefectPopup;
