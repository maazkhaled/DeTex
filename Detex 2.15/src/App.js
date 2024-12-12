import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import NavBar from "./components/NavBar";
import UserTable from "./components/UserTable";
import CreateUserButton from "./components/CreateUserButton";
import AttendanceLog from "./components/AttendanceLog";
import Dashboard from "./components/Dashboard";
import Backlog from "./components/Backlog"; // Import Backlog
import DefectBacklog from "./components/DefectBacklog"; // Import DefectBacklog
import LoginPage from "./components/Login";
import UserHome from "./components/UserHome";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);

    // Redirect based on user privilege
    if (userData.privilege === "Admin") {
      navigate("/dashboard"); // Admin gets the dashboard
    } else if (userData.privilege === "User") {
      navigate("/userhome"); // Regular users go directly to user home
    }
  };

  return (
    <div className="App">
      <div className="logo">
        DETEX
        {isAuthenticated && (
          <div className="welcome" style={{ float: "right" }}>
            Welcome, {user ? user.name : ""}
          </div>
        )}
      </div>

      {isAuthenticated && user && user.privilege === "Admin" && <NavBar />}
      <Routes>
        {isAuthenticated ? (
          <>
            {user && user.privilege === "Admin" && (
              <>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route
                  path="/user-management"
                  element={
                    <div className="main-content">
                      <h1 style={{ color: "white" }}>User Management</h1>
                      <UserTable />
                      <CreateUserButton />
                    </div>
                  }
                />
                <Route path="/attendance-log" element={<AttendanceLog />} />
                <Route path="/backlog" element={<Backlog />} />
                <Route path="/defect-backlog" element={<DefectBacklog />} /> {/* Add DefectBacklog route */}
              </>
            )}
            {user && user.privilege === "User" && (
              <Route path="/userhome" element={<UserHome />} />
            )}
          </>
        ) : (
          <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
        )}
      </Routes>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
