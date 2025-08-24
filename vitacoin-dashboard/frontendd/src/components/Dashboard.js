import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import StreakCalendar from './StreakCalendar';
import ApiService from '../services/api';
import './Dashboard.css';
import '../GlobalStyles.css';

// ===== Mock Data =====
const mockLeaderboardData = [
  { username: "Ahmad", coins: 850 },
  { username: "Jane", coins: 780 },
  { username: "CodeGenius", coins: 690 },
];

// ===== Components =====
const ClaimButton = ({ onClaim, userId }) => {
  const [canClaim, setCanClaim] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess: showToastSuccess, showError } = useToast();

  // Check claim status on component mount
  useEffect(() => {
    const checkClaimStatus = async () => {
      if (!userId) return;
      
      try {
        // Check if user has already claimed today by checking lastClaimDate
        const userData = await ApiService.getUserData(userId);
        const lastClaim = userData.user.lastClaimDate;
        const today = new Date().toDateString();
        const lastClaimDate = lastClaim ? new Date(lastClaim).toDateString() : null;
        
        setCanClaim(lastClaimDate !== today);
      } catch (error) {
        console.error('Error checking claim status:', error);
        setCanClaim(true); // Default to allowing claim if check fails
      }
    };
    
    checkClaimStatus();
  }, [userId]);


  const handleClick = async () => {
    if (!canClaim || isLoading || !userId) return;
    try {
      setIsLoading(true);
      
      const response = await ApiService.claimDailyBonus(userId);
      
      if (response.success) {
        setCanClaim(false);
        await onClaim();
        showToastSuccess(`Daily bonus claimed! You earned ${response.bonusAmount} coins!`);
      } else {
        showError(response.error || 'Failed to claim daily bonus');
      }
    } catch (error) {
      console.error('Error claiming daily bonus:', error);
      showError('Failed to claim daily bonus. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="claim-button-container">
      <button
        onClick={handleClick}
        disabled={!canClaim || isLoading}
        className={`claim-button ${canClaim ? 'active' : 'disabled'} ${isLoading ? 'loading' : ''}`}
      >
        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <span>Processing...</span>
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

const Transactions = ({ limit }) => {
  const mockTransactionsData = [
    { type: "earn", amount: 20, description: "Quiz completed", date: new Date(Date.now() - 3600000) },
    { type: "earn", amount: 10, description: "Daily login bonus", date: new Date(Date.now() - 7200000) },
    { type: "spend", amount: 10, description: "Missed daily streak", date: new Date(Date.now() - 10800000) },
  ];

  return (
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
};

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
const Dashboard = () => {
  const { user, refreshUser } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = user?._id;

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load leaderboard data
      const leaderboardResponse = await ApiService.getLeaderboard();
      setLeaderboard(leaderboardResponse.leaderboard || mockLeaderboardData);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data');
      setLeaderboard(mockLeaderboardData);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    try {
      const userId = user?._id;
      const response = await ApiService.claimDailyBonus(userId);
      if (response.success) {
        await refreshUser(); // Refresh user data from the database
        loadDashboardData(); // Reload dashboard data
      }
      return true;
    } catch (error) {
      console.error('Failed to claim bonus:', error);
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
                <div className="user-profile">
                  <div className="user-avatar">{(user?.username || user?.name || "Demo User").charAt(0).toUpperCase()}</div>
                  <span className="user-name">{user?.username || user?.name || "Demo User"}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Welcome Section */}
        <div className="welcome-section">
          <h2 className="welcome-title">
            Welcome back, <span className="welcome-name">{user?.username || user?.name || "User"}</span>
          </h2>
          <p className="welcome-subtitle">Your daily rewards and progress await.</p>
          
          <div className="claim-section">
            <ClaimButton onClaim={handleClaim} userId={user?._id} />
            <p className="claim-description">Claim your daily bonus and keep your streak alive.</p>
          </div>
        </div>

        {/* Streak Calendar */}
        <div className="dashboard-section">
          <h2 className="section-title">📅 Daily Streak Calendar</h2>
          <StreakCalendar />
        </div>

        {/* Badge System */}
        <div className="dashboard-section">
          <h2 className="section-title">🏆 Badges</h2>
          <div className="stats">
            <div className="stats-item">
              <div className="stat-value">{user?.coins || 0}</div>
              <div className="stat-label">Total Coins</div>
            </div>
            <div className="stats-item">
              <div className="stat-value">{user?.badges?.length || 0}</div>
              <div className="stat-label">Badges Earned</div>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="dashboard-section">
          <h2 className="section-title">🏆 Leaderboard</h2>
          <div className="leaderboard">
            {leaderboard.map((item, index) => (
              <div className="leaderboard-item" key={index}>
                <div className="rank">#{index + 1}</div>
                <div className="username">{item.username}</div>
                <div className="coins">{item.coins} coins</div>
                {user && item.username === user?.username && (
                  <div className="you-indicator">You</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;