import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import ImageUpload from './ImageUpload';
import './UserHome.css';
import DefectPopup from './DefectPopup';

function UserHome() {
  const [popupDefect, setPopupDefect] = useState(null);
  const [isDetectionPaused, setIsDetectionPaused] = useState(false);
  const [snapshot, setSnapshot] = useState(null);
  const [fabricType, setFabricType] = useState('cotton'); // Default fabric type
  const [recentDefects, setRecentDefects] = useState([]); // State for recent defects
  const imageRef = useRef(null); // Reference to the image displaying the processed frame

  const fabricTypes = [
    'cotton',
    'silk',
    'wool',
    'cashmere',
    'linen',
    'polyester',
    'velvet',
    'canvas',
    'other',
  ];

  useEffect(() => {
    const fetchRecentDefects = async () => {
      try {
        const response = await axios.get('http://localhost:5001/recent-defects');
        setRecentDefects(response.data);
      } catch (error) {
        console.error('Error fetching recent defects:', error);
      }
    };

    fetchRecentDefects();

    const interval = setInterval(fetchRecentDefects, 60000); // Fetch every 60 seconds
    return () => clearInterval(interval); // Clear interval on unmount
  }, []);

  useEffect(() => {
    let socket = io('http://localhost:5001');

    socket.on('connect', () => {
      console.log('Connected to server via WebSocket');
    });

    socket.on('predictions', (data) => {
      if (data.frame && !data.frame.startsWith('data:image/')) {
        console.error('Invalid frame format:', data.frame);
        return;
      }

      if (imageRef.current && data.frame) {
        imageRef.current.src = data.frame; // Use the base64 frame directly
      }

      if (!isDetectionPaused && Array.isArray(data.detections) && data.detections.length > 0) {
        const detectedDefect = data.detections[0];
        const classLabelIndex = detectedDefect.class_labels?.[0];
        const predictedClass = detectedDefect.class_names?.[classLabelIndex.toString()] || 'Unknown';

        detectedDefect.predictedClass = predictedClass;

        setIsDetectionPaused(true);
        setPopupDefect(detectedDefect);
        setSnapshot(data.frame); // Set snapshot as the base64 frame
      }
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      socket.disconnect();
    };
  }, [isDetectionPaused]);

  const handleFeedbackSubmit = async (feedback) => {
    if (popupDefect) {
      try {
        const formData = new FormData();
        formData.append('defectDetails', JSON.stringify(popupDefect));
        formData.append('feedback', feedback);
        formData.append('fabricType', fabricType);
        formData.append('snapshot', new Blob([snapshot], { type: 'image/jpeg' }), 'snapshot.jpg');

        await axios.post('http://localhost:5001/save-feedback', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        console.log('Feedback submitted');
        setPopupDefect(null);
        setIsDetectionPaused(false);
        setSnapshot(null);
      } catch (error) {
        console.error('Failed to submit feedback:', error);
      }
    }
  };

  return (
    <div className="UserHome">
      {/* FYP Logo and Details Section */}
      <div className="fyp-logo-container">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <img src="/logo.png" alt="FYP Logo" className="fyp-logo" />
        </div>

        <div className="fyp-details">
          <h2>Detect Defects in Real-Time</h2>
          <p>Empower Your Textile Business with Smarter Quality Control!</p>
          <div className="fyp-paragraphs">
            <p className="left-paragraph">
              Revolutionize Textile Quality Control with Real-Time Defect Detection! Our cutting-edge AI-powered system ensures flawless textiles, boosts efficiency, and minimizes waste.
            </p>
            <p className="right-paragraph">
              With a user-friendly interface and in-depth reporting, your business can make smarter decisions and maintain the highest standards effortlessly.
            </p>
          </div>
        </div>
      </div>

      <h2>Live Defect Detection</h2>

      {/* Fabric Type Dropdown */}
      <div className="fabric-type-selector">
        <label htmlFor="fabric-type">Select Fabric Type:</label>
        <select
          id="fabric-type"
          value={fabricType}
          onChange={(e) => setFabricType(e.target.value)}
        >
          {fabricTypes.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <ImageUpload />

      {/* Centered Script Frame */}
      <div className="webcam-section" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <img
          ref={imageRef}
          alt="Processed Frame"
          width={640}
          height={480}
          style={{ border: '1px solid #ccc' }}
        />
      </div>

      {popupDefect && (
        <DefectPopup
          defectDetails={popupDefect}
          snapshot={snapshot}
          onSubmitFeedback={handleFeedbackSubmit}
          fabricType={fabricType}
        />
      )}

      {/* Centered Recent Defects Section */}
      <div className="recent-defects-section">
        <h2 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '20px' }}>
          Today's 3 Most Recent Defects
        </h2>
        <div className="recent-defects">
          {recentDefects.length > 0 ? (
            recentDefects.map((defect, index) => (
              <div key={index} className="recent-defect">
                <img
                  src={`http://localhost:5001/uploads/${defect.imageFileName}`}
                  alt={`Defect ${index}`}
                  width={200}
                  height={200}
                  style={{ border: '1px solid #ccc', display: 'block', margin: '0 auto' }}
                />
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                  <h3>{defect.predictedClass}</h3>
                  <p>({defect.fabricType})</p>
                  <p>{new Date(defect.dateAndTime).toLocaleTimeString()}</p>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center' }}>No recent defects found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserHome;
