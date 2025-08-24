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
      <div style={{ padding: 24 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button onClick={() => setView("dashboard")}>Dashboard</button>
        <button onClick={() => setView("leaderboard")}>Leaderboard</button>
        <button onClick={() => setView("transactions")}>Transactions</button>
        <button onClick={() => setView("earn")}>Earn</button>
        <button onClick={() => setView("profile")}>Profile</button>
        <button onClick={() => setView("login")}>Login</button>
        <button onClick={() => setView("register")}>Register</button>
      </div>

        <div>
          {view === "dashboard" && <Dashboard user={mockUser} />}
          {view === "leaderboard" && <Leaderboard limit={10} />}
          {view === "transactions" && <Transactions userId={mockUser._id} />}
          {view === "earn" && <Earn />}
          {view === "profile" && <Profile />}
          {view === "login" && <Login />}
          {view === "register" && <Register />}
        </div>
      </div>
    </Router>
  );
}

export default App;
