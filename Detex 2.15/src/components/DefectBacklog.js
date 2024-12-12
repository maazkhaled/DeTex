import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DefectBacklog.css';

function DefectBacklog() {
  const [defects, setDefects] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFeedback, setSelectedFeedback] = useState('correct');

  useEffect(() => {
    const fetchDefects = async () => {
      try {
        const response = await axios.get('http://localhost:5001/defect-backlog');
        setDefects(response.data);
      } catch (error) {
        console.error('Error fetching defect backlog:', error);
      }
    };
    fetchDefects();
  }, []);

  const handleFeedbackSubmit = async () => {
    const currentDefect = defects[currentIndex];
    try {
      await axios.post('http://localhost:5001/update-feedback', {
        defectId: currentDefect._id,
        newFeedback: selectedFeedback,
      });
      alert('Feedback updated successfully.');
      setDefects((prev) => prev.filter((_, index) => index !== currentIndex));
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } catch (error) {
      console.error('Error updating feedback:', error);
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : defects.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < defects.length - 1 ? prev + 1 : 0));
  };

  if (!defects.length) {
    return <p>No defects to review.</p>;
  }

  const currentDefect = defects[currentIndex];

  console.log('Current Snapshot URL:', currentDefect.imageFileName);

  return (
    <div className="defect-backlog-container">
      <h2>Defect Backlog</h2>
      <div className="defect-backlog">
        <button onClick={handlePrev} className="arrow-button">{'<'}</button>
        <div className="defect-details">
          {currentDefect.imageFileName ? (
            <img
              src={
                currentDefect.imageFileName.startsWith('data:image/jpeg;base64,')
                  ? currentDefect.imageFileName
                  : `http://localhost:5001/uploads/${currentDefect.imageFileName}`
              }
              alt="Defect"
              className="defect-image"
            />
          ) : (
            <p>No snapshot available.</p>
          )}
          <p><strong>Predicted Class:</strong> {currentDefect.predictedClass}</p>
          <p><strong>Fabric Type:</strong> {currentDefect.fabricType}</p>
          <p><strong>Date:</strong> {new Date(currentDefect.dateAndTime).toLocaleString()}</p>
          <label>
            Update Feedback:
            <select
              value={selectedFeedback}
              onChange={(e) => setSelectedFeedback(e.target.value)}
            >
              <option value="correct">Correct</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>
          <button onClick={handleFeedbackSubmit}>Submit Feedback</button>
        </div>
        <button onClick={handleNext} className="arrow-button">{'>'}</button>
      </div>
    </div>
  );
}

export default DefectBacklog;
