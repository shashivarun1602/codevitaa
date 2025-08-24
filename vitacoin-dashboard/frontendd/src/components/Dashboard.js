import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import ApiService from '../services/api';
import BadgeSystem from './BadgeSystem';

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
];

// ===== Components =====
const ClaimButton = ({ onClaim, userId }) => {
  const [canClaim, setCanClaim] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Check claim status on component mount
  useEffect(() => {
    const checkClaimStatus = async () => {
      try {
        const response = await ApiService.claimDailyBonus(userId || 'user-123');
        // If we get an error about already claimed, disable the button
        setCanClaim(true);
      } catch (error) {
        if (error.message.includes('already claimed')) {
          setCanClaim(false);
        }
      }
    };
    checkClaimStatus();
  }, [userId]);

  const handleClick = async () => {
    if (canClaim && !isLoading) {
      setIsLoading(true);
      try {
        const response = await ApiService.claimDailyBonus(userId || 'user-123');
        if (response.success) {
          onClaim(response.bonusAmount);
          setShowSuccess(true);
          setCanClaim(false);
          setTimeout(() => setShowSuccess(false), 2000);
        }
      } catch (error) {
        console.error('Failed to claim bonus:', error);
        if (error.message.includes('already claimed')) {
          setCanClaim(false);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="claim-button-container">
      <button
        onClick={handleClick}
        disabled={!canClaim || isLoading}
        className={`claim-button ${canClaim ? 'active' : 'disabled'} ${isLoading ? 'loading' : ''} ${showSuccess ? 'success' : ''}`}
      >
        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <span>Processing...</span>
          </div>
        ) : showSuccess ? (
          <div className="success-animation">
            <span className="success-icon">✨</span>
            <span>+10 Coins Earned!</span>
            <span className="success-icon">✨</span>
          </div>
        ) : canClaim ? (
          <>
            <span className="coin-icon">🪙</span>
            Claim Daily Bonus
          </>
        ) : (
          "Already Claimed"
        )}
      </button>
      {showSuccess && (
        <div className="floating-coins">
          <div className="floating-coin">+10</div>
          <div className="floating-coin">💰</div>
          <div className="floating-coin">+10</div>
        </div>
      )}
    </div>
  );
};

const Leaderboard = ({ limit }) => {
  const [leaderboardData, setLeaderboardData] = useState(mockLeaderboardData);
  const [loading, setLoading] = useState(false);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getLeaderboard();
      if (response && response.length > 0) {
        setLeaderboardData(response);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      // Keep using mock data if API fails
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    // Refresh leaderboard every 30 seconds for real-time updates
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {loading && (
        <div className="text-center py-2">
          <span className="text-sm text-gray-500">Updating leaderboard...</span>
        </div>
      )}
      <ul className="space-y-2">
        {leaderboardData.slice(0, limit).map((user, index) => (
          <li
            key={user._id || index}
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
    </div>
  );
};

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
  const [userData, setUserData] = useState(user || mockUser);
  const [coins, setCoins] = useState(userData.coins);
  const [transactions, setTransactions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Demo user ID - in production, this would come from authentication
  const DEMO_USER_ID = 'demo-user-123';

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to load user data from API
      const response = await ApiService.getUserData(DEMO_USER_ID);
      setUserData(response.user);
      setCoins(response.user.coins);
      setTransactions(response.transactions || []);
      
      // Load leaderboard
      const leaderboardData = await ApiService.getLeaderboard();
      setLeaderboard(leaderboardData);
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError('Failed to load data. Using demo data.');
      // Fallback to mock data
      setUserData(mockUser);
      setCoins(mockUser.coins);
      setTransactions(mockTransactionsData);
      setLeaderboard(mockLeaderboardData);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (amount) => {
    try {
      const response = await ApiService.claimDailyBonus(DEMO_USER_ID);
      setCoins(response.newBalance);
      
      // Reload dashboard data to get updated transactions
      setTimeout(() => {
        loadDashboardData();
      }, 1000);
      
      return true;
    } catch (error) {
      console.error('Failed to claim bonus:', error);
      // Fallback to local update
      setCoins(prev => prev + amount);
      return false;
    }
  };

  const handleBadgeUnlock = (badge) => {
    console.log('Badge unlocked:', badge.name);
    // Could trigger additional rewards or notifications here
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            Vitacoin <span className="title-highlight">Dashboard</span>
          </h1>
          
          <div className="header-right">
            {loading ? (
              <div className="loading-placeholder">Loading...</div>
            ) : (
              <>
                <div className="coins-display">{coins} Coins</div>
                <div className="user-profile">
                  <div className="user-avatar">{(userData.username || userData.name || "Demo User").charAt(0).toUpperCase()}</div>
                  <span className="user-name">{userData.username || userData.name || "Demo User"}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Welcome Section */}
        <div className="welcome-section">
          <h2 className="welcome-title">
            Welcome back, <span className="welcome-name">{userData.name}</span>
          </h2>
          <p className="welcome-subtitle">Your daily rewards and progress await.</p>
          
          <div className="claim-section">
            <ClaimButton onClaim={handleClaim} />
            <p className="claim-description">Claim your daily bonus and keep your streak alive.</p>
          </div>
        </div>


        {/* Badge System */}
        <BadgeSystem 
          userCoins={coins} 
          onBadgeUnlock={handleBadgeUnlock}
        />
      </div>
    </div>
  );
};

export default Dashboard;