import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../GlobalStyles.css';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setMessage('Login successful! Redirecting...');
        setTimeout(() => navigate('/'), 1000);
      } else {
        setMessage(data.message || 'Login failed.');
      }
    } catch (err) {
      setMessage('Login failed.');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          Vitacoin <span className="page-title-highlight">Login</span>
        </h1>
      </div>
      
      <div className="content-card">
        <form onSubmit={handleLogin} className="form-container">
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="form-input"
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="form-input"
            required 
          />
          <button type="submit" className="form-button">Login to Account</button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <span>New to Vitacoin? </span>
          <button 
            onClick={() => navigate('/register')} 
            className="text-link"
            style={{ background: 'none', border: 'none' }}
          >
            Create Account
          </button>
        </div>
        
        {message && (
          <div className={`message ${message.includes('successful') ? 'message-success' : 'message-error'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
