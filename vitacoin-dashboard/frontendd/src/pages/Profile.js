import React, { useState } from "react";
import '../GlobalStyles.css';
import './Profile.css';
import BadgeSystem from '../components/BadgeSystem';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: "Demo User",
    email: "demo@vitacoin.com",
    username: "demouser123",
    bio: "Passionate learner exploring the world of programming and blockchain technology.",
    location: "San Francisco, CA",
    website: "https://github.com/demouser",
    coins: 1250,
    level: 2,
    badges: 3,
    joinDate: "2024-01-15",
    totalTasks: 24,
    quizzesCompleted: 8,
    streak: 12,
    achievements: [
      { name: "Quiz Master", description: "Completed 5 quizzes with 90%+ score", date: "2024-02-15" },
      { name: "Streak Champion", description: "Maintained 10-day login streak", date: "2024-02-10" },
      { name: "Task Warrior", description: "Completed 20 tasks", date: "2024-02-05" }
    ],
    stats: {
      totalEarned: 1250,
      averageScore: 87,
      favoriteCategory: "Python Programming",
      hoursLearning: 45
    }
  });

  const [editForm, setEditForm] = useState({
    name: user.name,
    bio: user.bio,
    location: user.location,
    website: user.website
  });

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({
      name: user.name,
      bio: user.bio,
      location: user.location,
      website: user.website
    });
  };

  const handleSave = () => {
    setUser({ ...user, ...editForm });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      name: user.name,
      bio: user.bio,
      location: user.location,
      website: user.website
    });
  };

  const handleInputChange = (field, value) => {
    setEditForm({ ...editForm, [field]: value });
  };

  const handleBadgeUnlock = (badge) => {
    console.log('Badge unlocked in Profile:', badge.name);
  };

  return (
    <div className="page-container">
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="avatar-overlay">
              <button className="change-avatar-btn">📷</button>
            </div>
          </div>
          
          <div className="profile-main-info">
            {isEditing ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="edit-input name-input"
                />
                <textarea
                  value={editForm.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="edit-textarea"
                  placeholder="Tell us about yourself..."
                />
              </div>
            ) : (
              <div className="profile-info">
                <h1 className="profile-name">{user.name}</h1>
                <p className="profile-username">@{user.username}</p>
                <p className="profile-bio">{user.bio}</p>
              </div>
            )}
            
            <div className="profile-stats-quick">
              <div className="stat-item">
                <span className="stat-number">{user.coins}</span>
                <span className="stat-label">Coins</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{user.badges}</span>
                <span className="stat-label">Badges</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{user.streak}</span>
                <span className="stat-label">Day Streak</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">Level {user.level}</span>
                <span className="stat-label">Current</span>
              </div>
            </div>
          </div>
          
          <div className="profile-actions">
            {isEditing ? (
              <div className="edit-actions">
                <button className="btn-save" onClick={handleSave}>Save</button>
                <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
              </div>
            ) : (
              <button className="btn-edit" onClick={handleEdit}>Edit Profile</button>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="profile-content">
          {/* Personal Information */}
          <div className="profile-section">
            <h3 className="section-title">📋 Personal Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Email</span>
                <span className="info-value">{user.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Location</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="edit-input-small"
                  />
                ) : (
                  <span className="info-value">{user.location}</span>
                )}
              </div>
              <div className="info-item">
                <span className="info-label">Website</span>
                {isEditing ? (
                  <input
                    type="url"
                    value={editForm.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="edit-input-small"
                  />
                ) : (
                  <a href={user.website} target="_blank" rel="noopener noreferrer" className="info-link">
                    {user.website}
                  </a>
                )}
              </div>
              <div className="info-item">
                <span className="info-label">Member Since</span>
                <span className="info-value">{new Date(user.joinDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="profile-section">
            <h3 className="section-title">📊 Learning Statistics</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <span className="stat-title">Total Earned</span>
                  <span className="stat-value">{user.stats.totalEarned} Coins</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-info">
                  <span className="stat-title">Average Score</span>
                  <span className="stat-value">{user.stats.averageScore}%</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📚</div>
                <div className="stat-info">
                  <span className="stat-title">Quizzes Completed</span>
                  <span className="stat-value">{user.quizzesCompleted}</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏰</div>
                <div className="stat-info">
                  <span className="stat-title">Learning Hours</span>
                  <span className="stat-value">{user.stats.hoursLearning}h</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <span className="stat-title">Tasks Completed</span>
                  <span className="stat-value">{user.totalTasks}</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🔥</div>
                <div className="stat-info">
                  <span className="stat-title">Best Streak</span>
                  <span className="stat-value">{user.streak} days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Badge System */}
          <BadgeSystem 
            userCoins={user.coins} 
            onBadgeUnlock={handleBadgeUnlock}
          />

          {/* Recent Achievements */}
          <div className="profile-section">
            <h3 className="section-title">🏆 Recent Achievements</h3>
            <div className="achievements-list">
              {user.achievements.map((achievement, index) => (
                <div key={index} className="achievement-item">
                  <div className="achievement-icon">🏅</div>
                  <div className="achievement-info">
                    <h4 className="achievement-name">{achievement.name}</h4>
                    <p className="achievement-description">{achievement.description}</p>
                    <span className="achievement-date">
                      Earned on {new Date(achievement.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Summary */}
          <div className="profile-section">
            <h3 className="section-title">📈 Activity Summary</h3>
            <div className="activity-summary">
              <div className="activity-item">
                <span className="activity-label">Favorite Category:</span>
                <span className="activity-value">{user.stats.favoriteCategory}</span>
              </div>
              <div className="activity-item">
                <span className="activity-label">Last Active:</span>
                <span className="activity-value">Today</span>
              </div>
              <div className="activity-item">
                <span className="activity-label">Account Status:</span>
                <span className="activity-value status-active">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
