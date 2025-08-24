import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, borderRadius: 12, boxShadow: '0 2px 12px #eee', background: '#fff' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: 10, marginBottom: 12, borderRadius: 6, border: '1px solid #ccc' }} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: 10, marginBottom: 12, borderRadius: 6, border: '1px solid #ccc' }} />
        <button type="submit" style={{ width: '100%', padding: 10, borderRadius: 6, background: '#ffd700', color: '#222', fontWeight: 'bold', border: 'none', fontSize: '1em' }}>Login</button>
      </form>
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <span>New user? </span>
        <button onClick={() => navigate('/register')} style={{ background: 'none', color: '#007bff', border: 'none', textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold' }}>Register here</button>
      </div>
      {message && (
        <div style={{ marginTop: '20px', color: message.includes('successful') ? 'green' : 'red', textAlign: 'center' }}>
          {message}
        </div>
      )}
    </div>
  );
}

export default Login;
