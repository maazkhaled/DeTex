const express = require('express');
const createUser = require('../createUser'); // Ensure the path is correct
const deleteUser = require('../deleteUser'); // Import deleteUser function
const changeUserPrivilege = require('../changeUserPrivilege'); // Import changeUserPrivilege function
const { connectToMongoDB } = require('../db');
const router = express.Router();
// Route to fetch all users
router.get('/users', async (req, res) => {
  try {
    const db = await connectToMongoDB();
    const users = await db.collection('userDB').find().toArray();
    res.json(users);
  } catch (error) {
    console.error('Failed to fetch users:', error.message);
    res.status(500).send('Failed to fetch users');
  }
});

// Route to get total users with "User" privileges
router.get('/total-users', async (req, res) => {
  try {
    const db = await connectToMongoDB();
    const userCount = await db.collection('userDB').countDocuments({ privilege: 'User' });
    res.status(200).json({ totalUsers: userCount });
  } catch (error) {
    console.error('Error fetching total users:', error);
    res.status(500).json({ message: 'Error fetching total users' });
  }
});

// Route to create a user
router.post('/createUser', async (req, res) => {
  const { username, password, privilege } = req.body;

  try {
    await createUser(username, password, privilege);
    res.status(200).send('User created successfully');
  } catch (error) {
    console.error('Failed to create user:', error.message);
    res.status(500).send(`Failed to create user: ${error.message}`);
  }
});

// Route to delete a user
router.delete('/deleteUser', async (req, res) => {
  const { username } = req.body;

  try {
    await deleteUser(username);
    res.status(200).send('User deleted successfully');
  } catch (error) {
    console.error('Failed to delete user:', error.message);
    res.status(500).send(`Failed to delete user: ${error.message}`);
  }
});


// Route to change user privileges
router.put('/changeUserPrivilege', async (req, res) => {
  const { username, newPrivilege } = req.body;

  try {
    await changeUserPrivilege(username, newPrivilege);
    res.status(200).send(`User privilege updated to ${newPrivilege}`);
  } catch (error) {
    console.error('Failed to change user privilege:', error.message);
    res.status(500).send(`Failed to change user privilege: ${error.message}`);
  }
});



module.exports = router;
