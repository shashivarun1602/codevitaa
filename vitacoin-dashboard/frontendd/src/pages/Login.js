import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ApiService from '../services/api';
import '../GlobalStyles.css';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    
    if (!email || !password) {
      showError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      const response = await ApiService.login(email, password);
      
      if (response.success) {
        // Use AuthContext login method to properly set user state
        await login(response.token, response.user);
        showSuccess('Login successful! Redirecting to dashboard...');
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        showError(response.message || 'Login failed.');
      }
    } catch (error) {
      showError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
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
          <button type="submit" className="form-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login to Account'}
          </button>
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
        
      </div>
    </div>
  );
}

export default Login;
