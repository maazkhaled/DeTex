import React, { useEffect, useState } from 'react';
import './AttendanceLog.css';

function AttendanceLog() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [showPastData, setShowPastData] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/attendance?date=${currentDate.toISOString().split('T')[0]}`
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Sort data to display the most recent entries first
        const sortedData = data.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return (
            dateB - dateA ||
            new Date(`1970/01/01 ${b.loginTime}`) -
              new Date(`1970/01/01 ${a.loginTime}`)
          );
        });

        setAttendanceData(sortedData);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      }
    };

    fetchAttendanceData();
  }, [currentDate]);

  const handleTogglePastData = () => {
    setShowPastData(!showPastData);
    if (!showPastData) {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      setCurrentDate(threeDaysAgo);
    } else {
      setCurrentDate(new Date());
    }
  };

  return (
    <div className="page-background">
      <div className="attendance-log-container">
        <h1>Attendance Details</h1>
        <h2>Employee Tracking</h2>
        <h3>
          Attendance log for {showPastData ? 'Past 3 Days' : 'Today'}
        </h3>
        <button onClick={handleTogglePastData}>
          {showPastData ? 'Show Today’s Attendance' : 'Show Past 3 Days Attendance'}
        </button>
        <table>
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Login Time</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((emp) => (
              <tr
                key={emp._id}
                style={{
                  backgroundColor: emp.present === 'no' ? 'lightcoral' : 'white',
                }}
              >
                <td>{emp.name}</td>
                <td>{emp.loginTime || 'Not Logged In'}</td>
                <td>{emp.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AttendanceLog;