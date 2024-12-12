const { connectToMongoDB } = require('./db');

async function deleteUser(name) {
  try {
    const db = await connectToMongoDB();
    console.log('Database connected successfully'); // Confirm the database connection

    // Delete the user from the database based on the name
    const result = await db.collection('userDB').deleteOne({ name });
    
    if (result.deletedCount === 0) {
      console.log(`No user found with the name: ${name}`);
    } else {
      console.log(`User deleted successfully: ${name}`); // Log the result of the deletion
    }
  } catch (error) {
    console.error('Error in deleteUser function:', error.message, error.stack);
    throw error; // Rethrow the error to catch it in the route handler
  }
}

module.exports = deleteUser;
