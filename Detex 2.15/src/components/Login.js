import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function LoginPage({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:5001/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response text:', errorText);
                throw new Error(errorText);
            }

            const data = await response.json();
            if (data.success) {
                onLogin(data.user);
            } else {
                alert(data.message || 'Login failed!');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed!'); // Inform the user about the error
        }
    };

    return (
        <div className="login-container">
            <h1 className="login-heading">DETEX</h1>
            <h2 className="login-subheading">Textile Defect Detection Made Easy</h2>
            <form className="login-form" onSubmit={handleLogin}>
                <label className="input-group">
                    Username: 
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </label>
                <label className="input-group">
                    Password: 
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <button type="submit" className="login-button">Login</button>
            </form>
        </div>
    );
}

export default LoginPage;

