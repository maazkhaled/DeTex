import React, { useState, useEffect } from "react";
import "./Dashboard.css"; // Import Dashboard CSS
import Metrics from "./Metrics";
import AttendanceLog from "./AttendanceLog"; // Import AttendanceLog component
import UserTable from "./UserTable"; // Import UserTable component
import { DefectClassificationChart } from "./DefectClassificationChart";
import { FeedbackDoughnutChart } from "./FeedbackDoughnutChart";
import { DefectsByFabricTypeHeatmap } from "./DefectsByFabricTypeHeatmap";

function Dashboard() {
  const [showAttendanceLog, setShowAttendanceLog] = useState(false); // State to manage Attendance Log
  const [showUserTable, setShowUserTable] = useState(false); // State to manage User Table
  const [users, setUsers] = useState([]); // State to manage users

  const handleToggleAttendanceLog = () => {
    setShowAttendanceLog(!showAttendanceLog); // Toggle the display of AttendanceLog component
  };

  const handleToggleUserTable = () => {
    setShowUserTable(!showUserTable); // Toggle the display of UserTable component
  };

  useEffect(() => {
    if (showUserTable) {
      // Fetch users only if UserTable is visible
      const fetchUsers = async () => {
        try {
          const response = await fetch("http://localhost:5001/users");
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          console.log("Fetched users:", data); // Debug log
          setUsers(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUsers();
    }
  }, [showUserTable]); // Dependency array to fetch users when `showUserTable` changes

  return (
    <>
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
              Revolutionize Textile Quality Control with Real-Time Defect
              Detection! Our cutting-edge AI-powered system ensures flawless
              textiles, boosts efficiency, and minimizes waste.
            </p>
            <p className="right-paragraph">
              With a user-friendly interface and in-depth reporting, your
              business can make smarter decisions and maintain the highest
              standards effortlessly.
            </p>
          </div>
        </div>
      </div>

      <div className="dashboard-container flex flex-col">
        <div className="header">
          <h1 className="text-2xl font-bold">Admin</h1>
        </div>

        <Metrics />

        <div className="grid grid-cols-3 gap-5">
          <div className="defect-classification-chart col-span-1">
            <DefectClassificationChart />
          </div>
          <div className="feedback-doughnut-chart col-span-1">
            <FeedbackDoughnutChart />
          </div>
          <div className="defects-by-fabric-type-heatmap col-span-1">
            <DefectsByFabricTypeHeatmap />
          </div>
        </div>

        {/* Dropdown button to show/hide AttendanceLog */}
        <div className="dropdown-button-container">
          <button
            className="dropdown-button"
            onClick={handleToggleAttendanceLog}
          >
            {showAttendanceLog ? "Hide Attendance Log" : "Show Attendance Log"}
          </button>
        </div>

        {/* Conditionally render AttendanceLog based on the state */}
        {showAttendanceLog && (
          <div className="attendance-log">
            <AttendanceLog />
          </div>
        )}

        {/* Dropdown button to show/hide UserTable */}
        <div className="dropdown-button-container">
          <button className="dropdown-button" onClick={handleToggleUserTable}>
            {showUserTable ? "Hide User Management" : "Show User Management"}
          </button>
        </div>

        {/* Conditionally render UserTable based on the state */}
        {showUserTable && (
          <div className="attendance-log">
            {" "}
            {/* Reuse the same class as AttendanceLog */}
            <UserTable users={users} />
          </div>
        )}

        {/* Contact section */}
        <div className="contact-section-container">
          <div className="contact-section">
            <h2>Contact Us</h2>
            <p>DETEX</p>
            <p>
              Email:{" "}
              <a href="mailto:animatepk.com@gmail.com">
                animatepk.com@gmail.com
              </a>
            </p>
            <p>
              Cellphone: <a href="tel:+03159209292">03159209292</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;