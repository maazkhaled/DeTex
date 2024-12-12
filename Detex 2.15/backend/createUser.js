const bcrypt = require('bcryptjs');
const { connectToMongoDB } = require('./db');

async function createUser(name, password, privilege) {
  try {
    const db = await connectToMongoDB();
    console.log('Database connected successfully'); // Confirm the database connection

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { name, password: hashedPassword, privilege };

    // Insert the user into the database
    const result = await db.collection('userDB').insertOne(user);
    console.log('User created successfully:', result); // Log the result of the insertion
  } catch (error) {
    console.error('Error in createUser function:', error.message, error.stack);
    throw error; // Rethrow the error to catch it in the route handler
  }
}

module.exports = createUser;
