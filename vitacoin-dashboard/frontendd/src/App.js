import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import './App.css';
import './AppNavigation.css';
import './GlobalStyles.css';
import './styles/responsive.css';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import CoinBalance from './components/CoinBalance';
import './styles/DarkMode.css';

// Import components
import Dashboard from './components/Dashboard';
import Leaderboard from './pages/Leaderboard';
import Transactions from './pages/Transactions';
import Earn from './pages/Earn';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

const AppNavigation = () => {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <nav className="app-navigation">
      <Link to={isAuthenticated ? "/dashboard" : "/"} className="nav-brand">
        <div className="brand-icon">💰</div>
        <span className="brand-text">Vitacoin</span>
      </Link>
      
      {/* Mobile menu button */}
      <button 
        className="mobile-menu-button"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <span className="hamburger-icon">☰</span>
      </button>

      <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className={`nav-button ${location.pathname === '/dashboard' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
              <span className="nav-icon">🏠</span>
              <span>Dashboard</span>
            </Link>
            <Link to="/earn" className={`nav-button ${location.pathname === '/earn' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
              <span className="nav-icon">💼</span>
              <span>Earn</span>
            </Link>
            <Link to="/leaderboard" className={`nav-button ${location.pathname === '/leaderboard' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
              <span className="nav-icon">🏆</span>
              <span>Leaderboard</span>
            </Link>
            <Link to="/transactions" className={`nav-button ${location.pathname === '/transactions' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
              <span className="nav-icon">📊</span>
              <span>Transactions</span>
            </Link>
            <Link to="/profile" className={`nav-button ${location.pathname === '/profile' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
              <span className="nav-icon">👤</span>
              <span>Profile</span>
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className={`nav-button ${location.pathname === '/login' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
              <span className="nav-icon">🔑</span>
              <span>Login</span>
            </Link>
            <Link to="/register" className={`nav-button ${location.pathname === '/register' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
              <span className="nav-icon">📝</span>
              <span>Register</span>
            </Link>
          </>
        )}
      </div>
      
      <div className="nav-actions">
        {isAuthenticated && <CoinBalance />}
        <ThemeToggle />
        {isAuthenticated && (
          <button onClick={logout} className="nav-button logout-button">
            <span className="nav-icon">🚪</span>
            <span>Logout</span>
          </button>
        )}
      </div>
    </nav>
  );
};

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ThemeProvider>
          <Router>
            <div className="App">
              <AppContent />
            </div>
          </Router>
        </ThemeProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <>
      <AppNavigation />
      <main className={isAuthenticated ? "main-content" : "auth-content"}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard user={user} />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard user={user} />
            </ProtectedRoute>
          } />
          <Route path="/leaderboard" element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          } />
          <Route path="/transactions" element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          } />
          <Route path="/earn" element={
            <ProtectedRoute>
              <Earn />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </>
  );
}

export default App;
