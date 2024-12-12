// NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/attendance-log">Attendance Log</Link></li>
        <li><Link to="/user-management">User Management</Link></li>
        <li><Link to="/defect-backlog">Defect Backlog</Link></li>

      </ul>
    </nav>
  );
}

export default NavBar;
