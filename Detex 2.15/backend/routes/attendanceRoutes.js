const express = require('express');
const { connectToMongoDB } = require('../db');
const router = express.Router();
// Route to log attendance
router.post('/logAttendance', async (req, res) => {
  const { username } = req.body;
  const loginTime = new Date();
  const currentDate = loginTime.toISOString().split('T')[0]; // Get date in YYYY-MM-DD format

  try {
    const db = await connectToMongoDB();
    const attendanceCollection = db.collection('attendance');

    // Check if there's already an attendance record for this user today
    const existingRecord = await attendanceCollection.findOne({
      name: username,
      date: currentDate,
    });

    if (!existingRecord) {
      // Log attendance only if there's no record for today
      await attendanceCollection.insertOne({
        name: username,
        loginTime: loginTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: currentDate,
        present: 'yes',
      });
      console.log(`Attendance logged for ${username} on ${currentDate}`);
      res.status(200).send('Attendance logged successfully.');
    } else {
      console.log(`Attendance already logged for ${username} today.`);
      res.status(200).send('Attendance already logged today.');
    }
  } catch (error) {
    console.error('Error logging attendance:', error);
    res.status(500).send('Failed to log attendance');
  }
});





// Route to get attendance data for today and mark absent users
router.get('/attendance', async (req, res) => {
    try {
      const db = await connectToMongoDB();
      const today = new Date().toISOString().split('T')[0];
  
      // Fetch all users with "User" privilege from userDB
      const users = await db.collection('userDB').find({ privilege: 'User' }).toArray();
  
      // Fetch today's attendance records
      const attendance = await db.collection('attendance').find({ date: today }).toArray();
  
      // Create a map of users who have logged in today
      const attendanceMap = new Map(attendance.map((record) => [record.name, record]));
  
      // Combine users with attendance, marking absent users
      const attendanceData = users.map((user) => {
        if (attendanceMap.has(user.name)) {
          return attendanceMap.get(user.name); // Return existing attendance record
        } else {
          return {
            name: user.name,
            loginTime: 'Not Logged In',
            date: today,
            present: 'no',
          };
        }
      });
  
      res.status(200).json(attendanceData);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      res.status(500).json({ message: 'Error fetching attendance data' });
    }
  });

// Route to get total absent employees for the current date
router.get('/total-absent', async (req, res) => {
    try {
      const db = await connectToMongoDB();
      const today = new Date().toISOString().split('T')[0];
  
      // Fetch all users with 'User' privilege
      const users = await db.collection('userDB').find({ privilege: 'User' }).toArray();
  
      // Fetch attendance records for today
      const attendance = await db.collection('attendance').find({ date: today }).toArray();
  
      // Find users who are marked as absent (not present today)
      const absentUsers = users.filter(user => {
        return !attendance.some(record => record.name === user.name && record.present === 'yes');
      });
  
      res.status(200).json({ totalAbsent: absentUsers.length });
    } catch (error) {
      console.error('Error fetching total absent employees:', error);
      res.status(500).json({ message: 'Error fetching total absent employees' });
    }
  });

module.exports = router;
