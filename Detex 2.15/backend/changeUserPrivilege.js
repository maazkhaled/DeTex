const { connectToMongoDB } = require('./db');

async function changeUserPrivilege(name, newPrivilege) {
  try {
    const db = await connectToMongoDB();
    console.log('Database connected successfully'); // Confirm the database connection

    // Update the user's privilege in the database
    const result = await db.collection('userDB').updateOne(
      { name }, // Find the user by name
      { $set: { privilege: newPrivilege } } // Set the new privilege
    );

    if (result.matchedCount === 0) {
      console.log(`No user found with the name: ${name}`);
    } else {
      console.log(`User privilege updated successfully: ${name} to ${newPrivilege}`);
    }
  } catch (error) {
    console.error('Error in changeUserPrivilege function:', error.message, error.stack);
    throw error; // Rethrow the error to catch it in the route handler
  }
}

module.exports = changeUserPrivilege;
