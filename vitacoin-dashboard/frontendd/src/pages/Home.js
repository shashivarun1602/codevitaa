import React from "react";
import Dashboard from "../components/Dashboard";

function Home() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return (
    <div>
      <h1>Welcome to Vitacoin Dashboard</h1>
      <Dashboard user={user} />
    </div>
  );
}

export default Home;
