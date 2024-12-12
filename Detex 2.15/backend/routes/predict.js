const path = require('path');
const { spawn } = require('child_process');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const predictDefect = (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath = path.join(__dirname, '..', req.file.path);
  const imageName = req.file.originalname;
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
    if (code !== 0) {
      console.error(`Python script exited with code ${code}: ${errorOutput}`);
      return res.status(500).send('Error running prediction.');
    }

    try {
      const jsonStartIndex = result.indexOf('[');
      const jsonEndIndex = result.lastIndexOf(']') + 1;

      if (jsonStartIndex === -1 || jsonEndIndex === -1) {
        console.error('Failed to locate JSON in the output.');
        return res.status(500).send('Invalid prediction output format.');
      }

      const cleanResult = result.substring(jsonStartIndex, jsonEndIndex);
      const parsedResult = JSON.parse(cleanResult);

      // Save prediction to MongoDB
      savePrediction(imageName, parsedResult, timestamp);
      res.json(parsedResult);
    } catch (e) {
      console.error('Error parsing result:', e);
      console.error('Result:', result);
      res.status(500).send('Error processing the prediction results.');
    }
  });
};

// Function to save prediction result to MongoDB
const savePrediction = async (imageName, predictionResult, timestamp) => {
  const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const db = client.db('i211686');
    const collection = db.collection('fabric');

    const predictedClass = predictionResult[0]?.class_names[Object.keys(predictionResult[0]?.class_names || {})[0]] || 'Unknown';

    await collection.insertOne({
      imageFileName: imageName,
      predictedClass,
      dateAndTime: timestamp,
      box_coords: predictionResult[0]?.box_coords || [],
    });
    console.log('Prediction saved to MongoDB');
  } catch (err) {
    console.error('Failed to save prediction:', err);
  } finally {
    await client.close();
  }
};

module.exports = { predictDefect };
