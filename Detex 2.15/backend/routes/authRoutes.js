const express = require('express');
const bcrypt = require('bcryptjs');
const { connectToMongoDB } = require('../db'); // Ensure the path to db is correct
const axios = require('axios'); // Make sure to import axios

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log(`Attempting to find user: ${username}`);
    const db = await connectToMongoDB();
    const user = await db.collection('userDB').findOne({ name: username });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // If user is not an admin, log attendance
    if (user.privilege === 'User') {
      try {
        await axios.post('http://localhost:5001/logAttendance', { username });
      } catch (attendanceError) {
        console.error('Error logging attendance:', attendanceError.message);
      }
    }

    res.status(200).json({ success: true, message: 'Login successful', user: { name: user.name, privilege: user.privilege } });

  } catch (error) {
    console.error('Error during login:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
