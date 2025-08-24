import React, { useState } from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import Dashboard from "./components/Dashboard";
import Leaderboard from "./components/Leaderboard";
import Transactions from "./pages/Transactions";
import Earn from "./pages/Earn";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ThemeProvider } from "./contexts/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";
import "./App.css";
import "./AppNavigation.css";
import "./styles/DarkMode.css";

const mockUser = {
  name: "Demo User",
  email: "demo@example.com",
  coins: 75,
  badges: ["Starter", "Contributor"],
  _id: "demo-1",
};

function App() {
  const [view, setView] = useState("dashboard");

  return (
    <ThemeProvider>
      <Router>
        <div className="app-container">
          <nav className="app-navigation">
            <div className="nav-brand">
              <span className="brand-icon">🪙</span>
              <span className="brand-text">Vitacoin</span>
            </div>
            
            <div className="nav-links">
              <button 
                className={`nav-button ${view === "dashboard" ? "active" : ""}`}
                onClick={() => setView("dashboard")}
              >
                <span className="nav-icon">📊</span>
                Dashboard
              </button>
              <button 
                className={`nav-button ${view === "leaderboard" ? "active" : ""}`}
                onClick={() => setView("leaderboard")}
              >
                <span className="nav-icon">🏆</span>
                Leaderboard
              </button>
              <button 
                className={`nav-button ${view === "transactions" ? "active" : ""}`}
                onClick={() => setView("transactions")}
              >
                <span className="nav-icon">💰</span>
                Transactions
              </button>
              <button 
                className={`nav-button ${view === "earn" ? "active" : ""}`}
                onClick={() => setView("earn")}
              >
                <span className="nav-icon">⚡</span>
                Earn
              </button>
              <button 
                className={`nav-button ${view === "profile" ? "active" : ""}`}
                onClick={() => setView("profile")}
              >
                <span className="nav-icon">👤</span>
                Profile
              </button>
              <button 
                className={`nav-button ${view === "login" ? "active" : ""}`}
                onClick={() => setView("login")}
              >
                <span className="nav-icon">🔑</span>
                Login
              </button>
              <button 
                className={`nav-button ${view === "register" ? "active" : ""}`}
                onClick={() => setView("register")}
              >
                <span className="nav-icon">📝</span>
                Register
              </button>
            </div>
            
            <div className="nav-actions">
              <ThemeToggle />
            </div>
          </nav>

          <main className="app-content">
            {view === "dashboard" && <Dashboard user={mockUser} />}
            {view === "leaderboard" && <Leaderboard limit={10} />}
            {view === "transactions" && <Transactions userId={mockUser._id} />}
            {view === "earn" && <Earn />}
            {view === "profile" && <Profile />}
            {view === "login" && <Login />}
            {view === "register" && <Register />}
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
