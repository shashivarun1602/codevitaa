import React, { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext';
import ApiService from '../services/api';
import './Leaderboard.css';

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data fallback
  const mockLeaderboard = [
    { _id: "1", username: "Alice", coins: 1250, level: 5, badges: ["🏆", "⭐", "💎"] },
    { _id: "2", username: "Bob", coins: 1180, level: 4, badges: ["🏆", "⭐"] },
    { _id: "3", username: "Charlie", coins: 1050, level: 4, badges: ["🏆"] },
    { _id: "4", username: "Diana", coins: 980, level: 3, badges: ["⭐"] },
    { _id: "5", username: "Eve", coins: 920, level: 3, badges: ["⭐"] },
  ];

  const fetchLeaderboard = async () => {
    try {
      setError(null);
      const response = await ApiService.getLeaderboard();
      if (response && response.length > 0) {
        setLeaderboardData(response);
      } else {
        setLeaderboardData(mockLeaderboard);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError('Failed to load leaderboard data');
      setLeaderboardData(mockLeaderboard);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchLeaderboard();
  };

  useEffect(() => {
    fetchLeaderboard();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return `#${rank}`;
    }
  };

  const isCurrentUser = (userId) => {
    return user && user._id === userId;
  };

  if (loading) {
    return (
      <div className="leaderboard-container">
        <div className="leaderboard-header">
          <h1>🏆 Leaderboard</h1>
        </div>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <div className="header-content">
          <h1>🏆 Leaderboard</h1>
          <p className="header-subtitle">See how you rank against other users</p>
        </div>
        <button 
          className={`refresh-button ${refreshing ? 'refreshing' : ''}`}
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <span className="refresh-icon">🔄</span>
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <div className="leaderboard-content">
        {/* Top 3 Podium */}
        <div className="podium-section">
          <h2 className="section-title">🏅 Top Performers</h2>
          <div className="podium">
            {leaderboardData.slice(0, 3).map((user, index) => (
              <div key={user._id} className={`podium-item rank-${index + 1} ${isCurrentUser(user._id) ? 'current-user' : ''}`}>
                <div className="podium-rank">{getRankIcon(index + 1)}</div>
                <div className="podium-avatar">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="podium-info">
                  <h3 className="podium-name">{user.username}</h3>
                  <div className="podium-coins">
                    <span className="coin-icon">💰</span>
                    {user.coins}
                  </div>
                  <div className="podium-level">Level {user.level || 1}</div>
                  {user.badges && user.badges.length > 0 && (
                    <div className="podium-badges">
                      {user.badges.slice(0, 3).map((badge, idx) => (
                        <span key={idx} className="badge">{badge}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Full Rankings */}
        <div className="rankings-section">
          <h2 className="section-title">📊 Full Rankings</h2>
          <div className="rankings-list">
            {leaderboardData.map((user, index) => (
              <div key={user._id} className={`ranking-item ${isCurrentUser(user._id) ? 'current-user' : ''}`}>
                <div className="ranking-position">
                  <span className="rank-number">{getRankIcon(index + 1)}</span>
                </div>
                <div className="ranking-avatar">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="ranking-info">
                  <h3 className="ranking-name">
                    {user.username}
                    {isCurrentUser(user._id) && <span className="you-badge">You</span>}
                  </h3>
                  <div className="ranking-stats">
                    <span className="stat">
                      <span className="coin-icon">💰</span>
                      {user.coins} coins
                    </span>
                    <span className="stat">
                      <span className="level-icon">⭐</span>
                      Level {user.level || 1}
                    </span>
                  </div>
                </div>
                {user.badges && user.badges.length > 0 && (
                  <div className="ranking-badges">
                    {user.badges.slice(0, 3).map((badge, idx) => (
                      <span key={idx} className="badge">{badge}</span>
                    ))}
                    {user.badges.length > 3 && (
                      <span className="badge-count">+{user.badges.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
