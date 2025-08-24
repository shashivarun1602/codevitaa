import React, { useState } from "react";
import { motion } from "framer-motion";

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
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      onClick={handleClick}
      disabled={!canClaim}
      className={`w-full px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 ${
        canClaim
          ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black"
          : "bg-gray-300 cursor-not-allowed text-gray-600"
      }`}
    >
      {canClaim ? "🎁 Claim Daily Bonus" : "✅ Already Claimed"}
    </motion.button>
  );
};

const Leaderboard = ({ limit }) => (
  <motion.ul initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
    {mockLeaderboardData.slice(0, limit).map((user, index) => (
      <motion.li
        key={index}
        whileHover={{ scale: 1.02 }}
        className="flex items-center justify-between px-5 py-3 rounded-xl bg-white/70 backdrop-blur-md shadow border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-500 w-6 text-center">{index + 1}</span>
          <span className="font-medium text-gray-700">{user.username}</span>
        </div>
        <span className="font-bold text-yellow-600">{user.coins} 💰</span>
      </motion.li>
    ))}
  </motion.ul>
);

const Transactions = ({ limit }) => (
  <motion.ul initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
    {mockTransactionsData.slice(0, limit).map((tx, index) => (
      <motion.li
        key={index}
        whileHover={{ scale: 1.01 }}
        className="flex justify-between items-center px-5 py-3 bg-white/70 backdrop-blur-md rounded-xl shadow border border-gray-200"
      >
        <div>
          <p className="text-sm font-medium text-gray-800">{tx.description}</p>
          <span className="text-xs text-gray-400">{new Date(tx.date).toLocaleDateString()}</span>
        </div>
        <span className={`text-sm font-bold ${tx.type === "earn" ? "text-green-600" : "text-red-600"}`}>
          {tx.type === "earn" ? "+" : "-"}{tx.amount}
        </span>
      </motion.li>
    ))}
  </motion.ul>
);

const BadgeProgress = ({ badges }) => {
  const currentBadge = badges.find(b => b.progress < b.goal) || badges[badges.length - 1];
  const progressPercentage = (currentBadge.progress / currentBadge.goal) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-full h-3">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progressPercentage}%` }}
        transition={{ duration: 1 }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
      ></motion.div>
    </div>
  );
};

// ===== Main Dashboard =====
const Dashboard = ({ user }) => {
  const userData = user || mockUser;
  const [coins, setCoins] = useState(userData.coins);
  const [badges, setBadges] = useState(userData.badges);

  const handleClaim = (amount) => {
    setCoins(coins + amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-white to-yellow-50 font-sans text-gray-800 p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto mt-8 p-8 rounded-3xl bg-white/80 backdrop-blur-xl shadow-2xl border border-yellow-100"
      >
        {/* Top Nav */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-extrabold text-yellow-600">Vitacoin <span className="text-gray-800">Dashboard</span></h1>

          <div className="flex items-center gap-4">
            <span className="px-4 py-2 rounded-full bg-yellow-200 text-yellow-800 font-bold shadow">💰 {coins}</span>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full shadow">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
                {userData.name.charAt(0)}
              </div>
              <span className="hidden sm:inline font-semibold">{userData.name}</span>
            </div>
          </div>
        </div>

        {/* Home Section */}
        <div className="text-center mb-12">
          <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-bold text-gray-900">
            Welcome back, <span className="text-yellow-600">{userData.name}</span> 🎓
          </motion.h2>
          <p className="text-gray-500 mb-6">Your rewards & progress are waiting 🚀</p>
          <ClaimButton onClaim={handleClaim} />
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
          {["📜 Transactions", "🏆 Leaderboard", "🎯 Earning Tasks", "👤 Profile"].map((label, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-r from-yellow-300 to-yellow-400 p-5 rounded-xl text-center font-semibold text-black shadow-md cursor-pointer"
            >
              {label}
            </motion.div>
          ))}
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div whileHover={{ scale: 1.01 }} className="p-6 rounded-2xl bg-white/70 backdrop-blur-md shadow">
            <h3 className="text-lg font-bold mb-4">🏅 Badge Progress</h3>
            <BadgeProgress badges={badges} />
          </motion.div>

          <motion.div whileHover={{ scale: 1.01 }} className="p-6 rounded-2xl bg-white/70 backdrop-blur-md shadow">
            <h3 className="text-lg font-bold mb-4">🔥 Top Learners</h3>
            <Leaderboard limit={3} />
          </motion.div>

          <motion.div whileHover={{ scale: 1.01 }} className="lg:col-span-2 p-6 rounded-2xl bg-white/70 backdrop-blur-md shadow">
            <h3 className="text-lg font-bold mb-4">💹 Recent Transactions</h3>
            <Transactions limit={5} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
