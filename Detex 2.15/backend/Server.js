const express = require('express');
const http = require('http'); // Added for Socket.IO
const cors = require('cors');
const fs = require('fs'); // Add fs module to handle file operations
const { spawn } = require('child_process');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const predictionRoutes = require('./routes/predictionRoutes');
const userRoutes = require('./routes/userRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const socketIO = require('socket.io'); // Added for Socket.IO

require('dotenv').config();

const app = express();
const server = http.createServer(app); // For Socket.IO
const io = socketIO(server, {
  cors: {
    origin: '*',
  },
});
const upload = require('multer')({ dest: 'uploads/' });
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit to 50mb
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static('uploads'));

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connection established'))
  .catch((err) => console.log('Failed to connect to MongoDB:', err));

app.use('/', authRoutes);
app.use('/', predictionRoutes);
app.use('/', userRoutes);
app.use('/', attendanceRoutes);

// EXISTING FILE UPLOAD PREDICTION ROUTE
app.post('/predict', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath = req.file.path;
  const timestamp = new Date();

  const pythonProcess = spawn('python3', ['predict.py', filePath]);

  let result = '';
  let errorOutput = '';

  pythonProcess.stdout.on('data', (data) => {
    result += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });

  pythonProcess.on('close', (code) => {
    console.log(`Python process exited with code: ${code}`);
    if (errorOutput) {
      console.error(`Python stderr: ${errorOutput}`);
    }
    console.log(`Raw output: ${result}`);

    if (result) {
      try {
        const jsonStart = result.indexOf('[');
        const jsonString = result.substring(jsonStart);
        const predictionResult = JSON.parse(jsonString);

        // Log the prediction result for debugging purposes
        console.log('Prediction Result:', predictionResult);

        if (predictionResult && predictionResult.length > 0 && predictionResult[0].class_names) {
          res.json(predictionResult); // Send the prediction result to the frontend
        } else {
          console.log('Prediction result is invalid or missing required properties.');
          res.status(200).send('No valid detections.');
        }
      } catch (e) {
        console.error('Error processing prediction:', e);
        res.status(500).send('Error processing the prediction results.');
      }
    } else {
      res.status(500).send('No output from Python script.');
    }
  });
});

// Define the Fabric model to store prediction and feedback
const Fabric = mongoose.model(
  'Fabric',
  new mongoose.Schema(
    {
      imageFileName: String,
      predictedClass: String,
      dateAndTime: Date,
      box_coords: Array, // Store bounding box coordinates
      feedback: String,  // Store user feedback
      fabricType: String, // Store fabric type
    },
    { collection: 'fabric' } // Ensure data is stored in the "fabric" collection
  )
);

// POST route to save feedback and the detected defect
app.post('/save-feedback', upload.single('snapshot'), async (req, res) => {
  const { feedback, fabricType } = req.body;
  const defectDetails = req.body.defectDetails;
  const snapshotFile = req.file; // Contains info about the uploaded file

  console.log('Received defect details:', defectDetails);
  console.log('Received feedback:', feedback);
  console.log('Received fabric type:', fabricType);

  if (!defectDetails || !feedback || !snapshotFile || !fabricType) {
    return res.status(400).send('Invalid defect details, feedback, snapshot, or fabric type.');
  }

  try {
    const defectDetailsObj = JSON.parse(defectDetails); // Parse defectDetails from JSON string

    // Validate the existence of class_labels and class_names
    const classLabelIndex = defectDetailsObj.class_labels ? defectDetailsObj.class_labels[0] : null;
    const predictedClass =
      defectDetailsObj.class_names && classLabelIndex !== null
        ? defectDetailsObj.class_names[classLabelIndex.toString()]
        : 'Unknown';

    // Save the prediction with feedback and fabric type into the "fabric" collection
    await Fabric.create({
      imageFileName: snapshotFile.filename, // Save the filename of the snapshot
      predictedClass: predictedClass,
      dateAndTime: new Date(),
      box_coords: defectDetailsObj.box_coords || [],
      feedback: feedback,
      fabricType: fabricType, // Save the fabric type
    });

    res.status(200).send('Feedback and prediction saved successfully.');
  } catch (error) {
    console.error('Failed to save feedback:', error);
    res.status(500).send('Failed to save feedback.');
  }
});

// Route to fetch the most recent three defects
app.get('/recent-defects', async (req, res) => {
  try {
    const recentDefects = await Fabric.find()
      .sort({ dateAndTime: -1 }) // Sort by date in descending order
      .limit(3); // Limit to the most recent 3 defects

    res.json(recentDefects);
  } catch (error) {
    console.error('Error fetching recent defects:', error);
    res.status(500).send('Error fetching recent defects.');
  }
});

// Route to get predictedClass counts
app.get('/class-frequencies', async (req, res) => {
  try {
    // Aggregate query to count occurrences of each predictedClass
    const classFrequencies = await Fabric.aggregate([
      { $group: { _id: '$predictedClass', count: { $sum: 1 } } },
    ]);

    res.json(classFrequencies);
  } catch (err) {
    console.error('Failed to fetch class frequencies:', err);
    res.status(500).send('Server error');
  }
});

app.get('/total-fabric-defects', async (req, res) => {
  try {
    const count = await Fabric.countDocuments({});
    res.json({ totalFabricDefects: count });
  } catch (err) {
    console.error('Failed to fetch fabric defect count:', err);
    res.status(500).send('Server error');
  }
});

// Route to get defects verified count
app.get('/defects-verified', async (req, res) => {
  try {
    const count = await Fabric.countDocuments({ feedback: 'correct' });
    res.json({ defectsVerified: count });
  } catch (err) {
    console.error('Failed to fetch defects verified count:', err);
    res.status(500).send('Server error');
  }
});

app.get('/defects-by-fabric-type-heatmap', async (req, res) => {
  try {
    const data = await Fabric.aggregate([
      {
        $group: {
          _id: {
            fabricType: "$fabricType",
            predictedClass: "$predictedClass",
          },
          count: { $sum: 1 },
        },
      },
    ]);

    // Transform data into a matrix
    const heatmapData = {};
    const fabricTypesSet = new Set();
    const defectTypesSet = new Set();

    data.forEach((item) => {
      const fabricType = item._id.fabricType;
      const defectType = item._id.predictedClass;

      if (fabricType && defectType) {
        fabricTypesSet.add(fabricType);
        defectTypesSet.add(defectType);

        if (!heatmapData[defectType]) {
          heatmapData[defectType] = {};
        }
        heatmapData[defectType][fabricType] = item.count;
      }
    });

    const fabricTypes = Array.from(fabricTypesSet).sort();
    const defectTypes = Array.from(defectTypesSet).sort();

    console.log('fabricTypes:', fabricTypes);
    console.log('defectTypes:', defectTypes);
    console.log('heatmapData:', heatmapData);

    res.json({
      fabricTypes,
      defectTypes,
      heatmapData,
    });
  } catch (err) {
    console.error('Failed to fetch defects by fabric type:', err);
    res.status(500).send('Server error');
  }
});

// Route to fetch feedback summary
app.get('/feedback-summary', async (req, res) => {
  try {
    const correct = await Fabric.countDocuments({ feedback: 'correct' });
    const rejected = await Fabric.countDocuments({ feedback: 'rejected' });
    const toBeReviewed = await Fabric.countDocuments({ feedback: 'to-be-reviewed' });

    res.json({
      correct,
      rejected,
      toBeReviewed,
    });
  } catch (err) {
    console.error('Failed to fetch feedback summary:', err);
    res.status(500).send('Failed to fetch feedback summary.');
  }
});

app.get('/defect-backlog', async (req, res) => {
  try {
    const defectsToReview = await Fabric.find({ feedback: 'to-be-reviewed' });
    res.json(defectsToReview);
  } catch (err) {
    console.error('Failed to fetch defect backlog:', err);
    res.status(500).send('Server error');
  }
});

app.post('/update-feedback', async (req, res) => {
  const { defectId, newFeedback } = req.body;
  try {
    await Fabric.updateOne({ _id: defectId }, { feedback: newFeedback });
    res.status(200).send('Feedback updated successfully.');
  } catch (err) {
    console.error('Failed to update feedback:', err);
    res.status(500).send('Server error');
  }
});


// Socket.IO setup
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  // Handle detection results from Python script
  socket.on('detection', (data) => {
    console.log('Received detection from Python script');
    // Broadcast detections and frame to all connected frontend clients
    socket.broadcast.emit('predictions', data);
  });
});

// Start the server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
