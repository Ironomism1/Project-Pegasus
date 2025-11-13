import React, { useState } from 'react';
// --- REMOVED: useNavigate is no longer needed here ---
import { useTranslation } from 'react-i18next';
import './App.css';

function LoginPage({ setLoggedInUser }) {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  // --- REMOVED: const navigate = useNavigate(); ---

  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage('Authenticating...');
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.user.role === 'user') {
          setMessage(`Welcome, ${data.user.username}! Redirecting...`);
          // --- THIS IS THE KEY CHANGE: App.js will handle the redirect automatically ---
          setLoggedInUser(data.user); 
          // --- REMOVED: setTimeout(() => navigate('/dashboard'), 1500); ---
        } else {
          setMessage(`Access Denied: Role '${data.user.role}' is not authorized.`);
          setLoggedInUser(null);
        }
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('Error: Could not connect to the server.');
    }
  };

  return (
    <div className="login-container">
      <div className="background-animation"></div>
      <div className="login-box">
        <div className="login-header">
          <h2>{t('lala_ai')}</h2>
          <p>{t('login_title')}</p>
        </div>
        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <input type="text" id="username" required value={username} onChange={(e) => setUsername(e.target.value)} />
            <label htmlFor="username">{t('username')}</label>
          </div>
          <div className="input-group">
            <input type="password" id="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            <label htmlFor="password">{t('password')}</label>
          </div>
          <button type="submit">{t('engage')}</button>
        </form>
        {message && <p className="login-status">{message}</p>}
      </div>
    </div>
  );
}

export default LoginPage;