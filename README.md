Textile Defect Detection System

Overview

This project is an AI-powered Textile Defect Detection System designed to identify fabric defects in real-time. It aims to assist the textile industry by automating defect detection, ensuring high-quality fabric production, and reducing waste.

The application provides:

Real-time defect detection using a live feed.
A user-friendly interface for monitoring and analyzing fabric defects.
Historical defect tracking, with detailed reporting and feedback capabilities.
Features

Real-Time Detection:

A live feed displays processed frames highlighting detected defects.
AI-powered model identifies fabric defects such as holes, stains, and irregularities.

Feedback System:

Users can provide feedback (e.g., "correct" or "rejected") for detected defects.
Feedback is stored for further analysis and to improve the system's accuracy.
Defect History:

Displays the 3 most recent defects detected.
Allows users to review defect details, including the type, timestamp, and associated fabric type.
Fabric Type Selection:

Dropdown menu to specify the type of fabric (e.g., cotton, silk, wool, etc.) being inspected.

Image Upload:

Upload specific images for defect analysis.

WebSocket Integration:

Real-time communication between the server and the client ensures instant updates on defect detection.
Tech Stack

Frontend:

React.js
CSS for styling
Backend:

Node.js
Express.js

Database:

MongoDB for storing defect details and user feedback.

AI Model:

YOLOv8 

Communication:

Socket.io for real-time communication.
Installation and Setup
Prerequisites
Install Node.js and npm.
Install MongoDB and ensure it's running.
Install Python for training or deploying the YOLO model (if required).
Steps

Clone the repository:


git clone https://github.com/your-username/textile-defect-detection.git
cd textile-defect-detection

Install dependencies:


npm install

Start the backend server:


cd backend
npm start

Start the frontend server:


cd frontend
npm start
Access the application in your browser at http://localhost:3000.

Usage

Real-Time Defect Detection:

Start the backend and connect your webcam or upload images for analysis.
Monitor the live feed for detected defects.

Feedback System:

Review detected defects and submit feedback to improve the system.

Review Recent Defects:

Check the 3 most recent defects with detailed information.

Change Fabric Type:

Select the fabric type from the dropdown for accurate defect categorization.
Project Structure

.
├── backend/                 # Backend server code
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── controllers/         # Business logic
│   ├── server.js            # Main backend server
├── frontend/                # Frontend code (React.js)
│   ├── components/          # React components
│   ├── pages/               # Main pages
│   ├── App.js               # Entry point
├── README.md                # Project documentation
└── package.json             # Dependencies and scripts
API Endpoints
Backend

GET /recent-defects: Fetch the 3 most recent defects.
POST /save-feedback: Save user feedback for a detected defect.
POST /upload: Upload an image for defect detection.
Contributing
Contributions are welcome! If you'd like to contribute, follow these steps:

Fork the repository.
Create a new branch for your feature/bugfix.


git checkout -b feature-name
Commit your changes and push to your fork.

git push origin feature-name
Open a pull request on the main repository.


Acknowledgements
YOLOv8: For the pre-trained object detection model.
Socket.io: For enabling real-time communication.
React.js: For building the responsive user interface.
Future Enhancements
Integration with cloud-based storage for defect data.
Enhanced AI models for detecting a wider range of fabric defects.
Improved dashboard with detailed analytics and visualization.
