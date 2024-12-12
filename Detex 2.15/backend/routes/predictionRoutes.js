const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

router.get('/latest-prediction', async (req, res) => {
    const client = new MongoClient(process.env.MONGO_URI);
    try {
        await client.connect();
        const db = client.db("i211686");
        const collection = db.collection("fabric");
        const latestPrediction = await collection.find().sort({ dateAndTime: -1 }).limit(1).toArray();
        if (latestPrediction.length > 0) {
            res.json(latestPrediction[0]);
        } else {
            res.status(404).send('No predictions found');
        }
    } catch (err) {
        console.error('Failed to fetch predictions:', err);
        res.status(500).send('Server error');
    } finally {
        await client.close();
    }
});

module.exports = router;
