import React, { useState } from "react";

// ===== Mock Data =====
const mockUser = {
  name: "Jane",
  coins: 250,
  badges: [
    { name: "First Steps", progress: 100, goal: 100, icon: "👟" },
    { name: "Explorer", progress: 80, goal: 100, icon: "🗺️" },
    { name: "Code Master", progress: 20, goal: 50, icon: "💻" },
  ],
  _id: "user-123"
};

const mockLeaderboardData = [
  { username: "Ahmad", coins: 850 },
  { username: "Jane", coins: 780 },
  { username: "CodeGenius", coins: 690 },
];

const mockTransactionsData = [
  { type: "earn", amount: 20, description: "Quiz completed", date: new Date(Date.now() - 3600000) },
  { type: "earn", amount: 10, description: "Daily login bonus", date: new Date(Date.now() - 7200000) },
  { type: "spend", amount: 10, description: "Missed daily streak", date: new Date(Date.now() - 10800000) },
  { type: "earn", amount: 50, description: "Onboarding bonus", date: new Date(Date.now() - 86400000) },
  { type: "earn", amount: 10, description: "Daily login bonus", date: new Date(Date.now() - 172800000) },
];

// ===== Components =====
const ClaimButton = ({ onClaim }) => {
  const [canClaim, setCanClaim] = useState(true);

  const handleClick = () => {
    if (canClaim) {
      setTimeout(() => {
        onClaim(10);
        setCanClaim(false);
      }, 1000);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={!canClaim}
      className={`w-full px-8 py-4 rounded-md font-medium text-base transition-all duration-200 border ${{
        true: "bg-gray-900 text-white hover:bg-gray-800 border-gray-900",
        false: "bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed"
      }[canClaim]}`}
    >
      {canClaim ? "Claim Daily Bonus" : "Already Claimed"}
    </button>
  );
};

const Leaderboard = ({ limit }) => (
  <ul className="space-y-2">
    {mockLeaderboardData.slice(0, limit).map((user, index) => (
      <li
        key={index}
        className="flex items-center justify-between px-4 py-3 rounded-md border border-gray-200 bg-white"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-500 w-6 text-center">{index + 1}</span>
          <span className="font-medium text-gray-800">{user.username}</span>
        </div>
        <span className="font-semibold text-gray-700 text-sm">{user.coins} Coins</span>
      </li>
    ))}
  </ul>
);

const Transactions = ({ limit }) => (
  <ul className="space-y-2">
    {mockTransactionsData.slice(0, limit).map((tx, index) => (
      <li
        key={index}
        className="flex justify-between items-center bg-white p-3 rounded-md border border-gray-200"
      >
        <div>
          <p className="text-sm font-medium text-gray-700">{tx.description}</p>
          <span className="text-xs text-gray-400">
            {new Date(tx.date).toLocaleDateString()}
          </span>
        </div>
        <span
          className={`text-sm font-semibold ${
            tx.type === "earn" ? "text-green-600" : "text-red-600"
          }`}
        >
          {tx.type === "earn" ? "+" : "-"}
          {tx.amount}
        </span>
      </li>
    ))}
  </ul>
);

const BadgeProgress = ({ badges }) => {
  const currentBadge = badges.find(b => b.progress < b.goal) || badges[badges.length - 1];
  const progressPercentage = (currentBadge.progress / currentBadge.goal) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
        style={{ width: `${progressPercentage}%` }}
      ></div>
    </div>
  );
};

// ===== Main Dashboard =====
const Dashboard = ({ user }) => {
  const userData = user || mockUser;
  const [coins, setCoins] = useState(userData.coins);

  const handleClaim = (amount) => {
    setCoins(coins + amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 p-6 fade-in">
      <div className="max-w-5xl mx-auto mt-8 p-8 rounded-lg bg-white shadow border border-gray-200 slide-up">
        {/* Top Nav */}
  <div className="flex justify-between items-center mb-8 fade-in">
          <h1 className="text-xl font-bold text-gray-900">
            Vitacoin <span className="text-blue-600">Dashboard</span>
          </h1>

          <div className="flex items-center gap-4 fade-in">
            <span className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 font-medium border border-gray-300">
              {coins} Coins
            </span>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md border border-gray-300">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
                {userData.name.charAt(0)}
              </div>
              <span className="hidden sm:inline font-semibold text-gray-700">{userData.name}</span>
            </div>
          </div>
        </div>

        {/* Home Section */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 fade-in">
            Welcome back, <span className="text-blue-600">{userData.name}</span>
          </h2>
          <p className="text-gray-500 mb-6 fade-in">Your daily rewards and progress await.</p>
          <div className="mx-auto w-64 mt-4 fade-in">
            <ClaimButton onClaim={handleClaim} />
          </div>
          <p className="mt-3 text-xs text-gray-400 fade-in">Claim your daily bonus and keep your streak alive.</p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {["Transactions", "Leaderboard", "Earning Tasks", "Profile"].map((label, idx) => (
            <div
              key={idx}
              className="bg-gray-50 p-4 rounded-md text-center font-medium text-gray-700 border border-gray-200 hover:bg-gray-100 cursor-pointer btn-animated fade-in"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-md bg-white border border-gray-200 shadow-sm fade-in slide-up">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Badge Progress</h3>
            <BadgeProgress badges={userData.badges} />
          </div>

          <div className="p-6 rounded-md bg-white border border-gray-200 shadow-sm fade-in slide-up">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Top Learners</h3>
            <Leaderboard limit={3} />
          </div>

          <div className="lg:col-span-2 p-6 rounded-md bg-white border border-gray-200 shadow-sm fade-in slide-up">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Recent Transactions</h3>
            <Transactions limit={5} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;