import React, { useState } from "react";
import axios from "axios";
import DefectPopup from "./DefectPopup";
import "./ImageUpload.css";

function ImageUpload() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [popupDefect, setPopupDefect] = useState(null);
  const [snapshot, setSnapshot] = useState(null);
  const [fabricType, setFabricType] = useState("cotton"); // Default fabric type

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5001/predict", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data && response.data.length > 0) {
        const detectedDefect = response.data[0];

        // Extracting class names and labels
        const defectDetails = detectedDefect.class_labels.map((label, index) => ({
          label: label,
          name: detectedDefect.class_names[label.toString()] || "Unknown",
        }));

        detectedDefect.details = defectDetails;

        // Display popup with the result
        setPopupDefect(detectedDefect);
        setSnapshot(URL.createObjectURL(file)); // Use the uploaded file as the snapshot
      } else {
        alert("No defects detected in the image.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to process the image.");
    }
  };

  const handleFeedbackSubmit = async (feedback) => {
    if (popupDefect) {
      try {
        const formData = new FormData();
        formData.append("defectDetails", JSON.stringify(popupDefect));
        formData.append("feedback", feedback);
        formData.append("fabricType", fabricType);
        formData.append("snapshot", file, file.name);

        await axios.post("http://localhost:5001/save-feedback", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        alert("Feedback submitted successfully.");
        setPopupDefect(null);
        setSnapshot(null);
      } catch (error) {
        console.error("Failed to submit feedback:", error);
        alert("Failed to submit feedback.");
      }
    }
  };

  return (
    <div className="ImageUpload">
      <div className="form-container">
        <form onSubmit={(e) => e.preventDefault()}>
          <input type="file" onChange={handleFileChange} />
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="image-preview" />
          ) : (
            <img
              src="/logo2.jpg"
              alt="Logo"
              className="upload-logo"
              style={{ visibility: file ? "hidden" : "visible" }}
            />
          )}
          <button type="button" onClick={handleUpload}>
            Predict
          </button>
        </form>
      </div>

      {popupDefect && (
        <DefectPopup
          defectDetails={popupDefect}
          snapshot={snapshot}
          onSubmitFeedback={handleFeedbackSubmit}
          fabricType={fabricType}
        />
      )}
    </div>
  );
}

export default ImageUpload;
