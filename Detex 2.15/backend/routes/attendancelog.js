const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/attendanceDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Define the Attendance schema and model
const attendanceSchema = new mongoose.Schema({
    name: String,
    present: String // Assuming this is a string "yes" or "no"
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

// API route to fetch attendance data
app.get('/attendance', async (req, res) => {
    try {
        const attendanceRecords = await Attendance.find();
        res.json(attendanceRecords);
    } catch (error) {
        console.error('Error fetching attendance records:', error);
        res.status(500).send(error);
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
