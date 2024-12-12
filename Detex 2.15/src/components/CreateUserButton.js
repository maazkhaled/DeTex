import React, { useState } from 'react';
import axios from 'axios';
import './CreateUserButton.css'; // Import the CSS

function CreateUserButton() {
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [privilege, setPrivilege] = useState('User');

  const handleCreateUser = async () => {
    console.log('User Input:', { username, password, privilege }); // Log user input
    try {
      await axios.post('http://localhost:5001/createUser', { username, password, privilege });
      alert('User created successfully!');
    } catch (error) {
      console.error('Error creating user:', error.response?.data || error.message); // Show detailed error
      alert('Failed to create user.');
    }
  };

  return (
    <div className="page-background">
    <div>
      <button className="create-user-btn" onClick={() => setShowForm(!showForm)}>
        Create User
      </button>

      {showForm && (
        <div className="form-container"> {/* Added class for white background */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div>
            <label>
              <input
                type="radio"
                value="User"
                checked={privilege === 'User'}
                onChange={() => setPrivilege('User')}
              />
              User
            </label>
            <label>
              <input
                type="radio"
                value="Admin"
                checked={privilege === 'Admin'}
                onChange={() => setPrivilege('Admin')}
              />
              Admin
            </label>
          </div>
          <button onClick={handleCreateUser}>Submit</button>
        </div>
      )}
    </div>
    </div>
  );
}

export default CreateUserButton;