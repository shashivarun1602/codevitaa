import React, { useState } from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import Dashboard from "./components/Dashboard";
import Leaderboard from "./components/Leaderboard";
import Transactions from "./components/Transactions";
import Earn from "./pages/Earn";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";
import "./AppNavigation.css";

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
    <Router>
      <div className="app-container">
        <nav className="app-navigation">
          <button 
            className={`nav-button ${view === "dashboard" ? "active" : ""}`}
            onClick={() => setView("dashboard")}
          >
            Dashboard
          </button>
          <button 
            className={`nav-button ${view === "leaderboard" ? "active" : ""}`}
            onClick={() => setView("leaderboard")}
          >
            Leaderboard
          </button>
          <button 
            className={`nav-button ${view === "transactions" ? "active" : ""}`}
            onClick={() => setView("transactions")}
          >
            Transactions
          </button>
          <button 
            className={`nav-button ${view === "earn" ? "active" : ""}`}
            onClick={() => setView("earn")}
          >
            Earn
          </button>
          <button 
            className={`nav-button ${view === "profile" ? "active" : ""}`}
            onClick={() => setView("profile")}
          >
            Profile
          </button>
          <button 
            className={`nav-button ${view === "login" ? "active" : ""}`}
            onClick={() => setView("login")}
          >
            Login
          </button>
          <button 
            className={`nav-button ${view === "register" ? "active" : ""}`}
            onClick={() => setView("register")}
          >
            Register
          </button>
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
  );
}

export default App;
