// const { MongoClient } = require('mongodb');
// require('dotenv').config();

// const url = process.env.MONGO_URI;
// const dbName = "i211686"; // Use your actual database name

// let client;

// async function connectToMongoDB() {
//     if (!client) {
//         client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
//         await client.connect();
//         console.log('Connected to MongoDB');
//     }
//     return client.db(dbName);
// }

// module.exports = { connectToMongoDB };

const { MongoClient } = require('mongodb');
require('dotenv').config();
const url = process.env.MONGO_URI; // Ensure this is correct in your .env file
const client = new MongoClient(url);

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db("i211686");
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        throw err;  // Rethrow or handle the error appropriately
    }
}

module.exports = { connectToMongoDB };
