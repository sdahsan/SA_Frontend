import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = 'http://localhost:5010/api/user';

function App() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/info`);
      if (!response.ok) throw new Error('Database records failed.');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setMessage({ text: 'Could not load data from backend.', type: 'error' });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) throw new Error('Registration failed.');
      setMessage({ text: 'User successfully registered!', type: 'success' });
      setUsername(''); setPassword(''); fetchUsers();
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
    }
  };

  return (
    <div className="container">
      <h1>Police System Management Panel</h1>
      {message.text && <div className={`message ${message.type}`}>{message.text}</div>}
      <div className="dashboard-grid">
        <div className="card">
          <h2>Register Account</h2>
          <form onSubmit={handleRegister}>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" style={{marginBottom:'10px', padding:'8px', width:'100%'}} />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" style={{marginBottom:'10px', padding:'8px', width:'100%'}} />
            <button type="submit" style={{padding:'10px', width:'100%', background:'#3182ce', color:'white', border:'none'}}>Register</button>
          </form>
        </div>
        <div className="card">
          <h2>Active User Records ({users.length})</h2>
          <ul>
            {users.map((user) => (
              <li key={user.id} style={{padding:'5px 0'}}>{user.username} (ID: #{user.id})</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
