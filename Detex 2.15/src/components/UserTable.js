import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserTable.css'; // Adjust the path as needed

const UserTable = () => {
  const [users, setUsers] = useState([]);

  // Function to fetch users from the database
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5001/users'); // Replace with your correct endpoint
      setUsers(response.data); // Assuming the backend sends an array of user objects
    } catch (error) {
      console.error('Error fetching users:', error.response?.data || error.message);
      alert('Failed to fetch users.');
    }
  };

  // Fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to delete a user
  const handleDeleteUser = async (username) => {
    try {
      await axios.delete('http://localhost:5001/deleteUser', {
        data: { username },
        headers: { 'Content-Type': 'application/json' },
      });
      alert('User deleted successfully!');
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error deleting user:', error.response?.data || error.message);
      alert('Failed to delete user.');
    }
  };

  // Function to change user privilege
  const handleChangePrivilege = async (username, currentPrivilege) => {
    const newPrivilege = currentPrivilege === 'User' ? 'Admin' : 'User'; // Toggle privilege for demo
    try {
      await axios.put('http://localhost:5001/changeUserPrivilege', {
        username,
        newPrivilege,
      });
      alert(`Privilege updated to ${newPrivilege}!`);
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error updating privilege:', error.response?.data || error.message);
      alert('Failed to update privilege.');
    }
  };

  return (
    <div className="page-background">
    <table>
      <thead>
        <tr>
          <th>Employee Name</th>
          <th>Privileges</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => (
          <tr key={index}>
            <td>{user.name}</td>
            <td>{user.privilege}</td>
            <td>
              <button className="delete-btn" onClick={() => handleDeleteUser(user.name)}>
                Delete
              </button>
              <button className="assign-privileges-btn" onClick={() => handleChangePrivilege(user.name, user.privilege)}>
                Assign Privileges
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
  
};

export default UserTable;