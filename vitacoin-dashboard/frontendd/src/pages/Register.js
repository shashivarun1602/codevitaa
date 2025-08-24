import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ApiService from '../services/api';
import '../GlobalStyles.css';

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    
    // Validation
    if (!username || !email || !password || !confirmPassword) {
      showError('Please fill in all fields.');
      setLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      showError('Passwords do not match.');
      setLoading(false);
      return;
    }
    
    if (password.length < 6) {
      showError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }
    
    try {
      const response = await ApiService.register(username, email, password);
      
      if (response.success) {
        // Use AuthContext login method to properly set user state
        await login(response.token, response.user);
        showSuccess('Registration successful! Welcome to Vitacoin!');
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        showError(response.message || 'Registration failed.');
      }
    } catch (error) {
      showError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          Vitacoin <span className="page-title-highlight">Register</span>
        </h1>
      </div>
      
      <div className="content-card">
        <form onSubmit={handleRegister} className="form-container">
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            className="form-input"
            required 
          />
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
          <input 
            type="password" 
            placeholder="Confirm Password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            className="form-input"
            required 
          />
          
          {message && (
            <div className={`message ${message.includes('successful') ? 'message-success' : 'message-error'}`}>
              {message}
            </div>
          )}
          
          <button type="submit" className="form-button" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <span>Already have an account? </span>
          <button 
            onClick={() => navigate('/login')} 
            className="text-link"
            style={{ background: 'none', border: 'none' }}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
