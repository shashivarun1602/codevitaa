import React, { useState, useEffect } from 'react';
import './BadgeSystem.css';

const BadgeSystem = ({ userCoins, onBadgeUnlock }) => {
  const [unlockedBadges, setUnlockedBadges] = useState([]);
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(null);

  const badges = [
    {
      id: 1,
      name: "Bronze Explorer",
      description: "Earned your first 100 coins",
      minCoins: 100,
      maxCoins: 500,
      image: "/src/assets/badges/bronze-badge.svg",
      color: "#CD7F32",
      gradient: "linear-gradient(135deg, #CD7F32 0%, #8B4513 100%)"
    },
    {
      id: 2,
      name: "Silver Achiever", 
      description: "Reached 501 coins milestone",
      minCoins: 501,
      maxCoins: 1300,
      image: "/src/assets/badges/silver-badge.svg",
      color: "#C0C0C0",
      gradient: "linear-gradient(135deg, #C0C0C0 0%, #808080 100%)"
    },
    {
      id: 3,
      name: "Gold Master",
      description: "Accumulated 1301 coins",
      minCoins: 1301,
      maxCoins: 2500,
      image: "/src/assets/badges/gold-badge.svg",
      color: "#FFD700",
      gradient: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)"
    },
    {
      id: 4,
      name: "Diamond Elite",
      description: "Reached 2501 coins milestone",
      minCoins: 2501,
      maxCoins: 4000,
      image: "/src/assets/badges/diamond-badge.svg",
      color: "#00BFFF",
      gradient: "linear-gradient(135deg, #00BFFF 0%, #0080FF 100%)"
    },
    {
      id: 5,
      name: "Legendary Champion",
      description: "Achieved 4000+ coins",
      minCoins: 4000,
      maxCoins: Infinity,
      image: "/src/assets/badges/legendary-badge.svg",
      color: "#9932CC",
      gradient: "linear-gradient(135deg, #9932CC 0%, #8A2BE2 100%)"
    }
  ];

  useEffect(() => {
    const newUnlockedBadges = badges.filter(badge => userCoins >= badge.minCoins);
    const previouslyUnlocked = unlockedBadges.map(b => b.id);
    const newlyUnlocked = newUnlockedBadges.filter(badge => !previouslyUnlocked.includes(badge.id));
    
    if (newlyUnlocked.length > 0) {
      const latestBadge = newlyUnlocked[newlyUnlocked.length - 1];
      setShowUnlockAnimation(latestBadge);
      onBadgeUnlock && onBadgeUnlock(latestBadge);
      
      setTimeout(() => {
        setShowUnlockAnimation(null);
      }, 3000);
    }
    
    setUnlockedBadges(newUnlockedBadges);
  }, [userCoins]);

  const getProgressToNextBadge = () => {
    const nextBadge = badges.find(badge => userCoins < badge.minCoins);
    if (!nextBadge) return { progress: 100, nextBadge: null };
    
    const previousBadge = badges.find(badge => 
      userCoins >= badge.minCoins && userCoins <= badge.maxCoins
    );
    
    const startCoins = previousBadge ? previousBadge.minCoins : 0;
    const progress = ((userCoins - startCoins) / (nextBadge.minCoins - startCoins)) * 100;
    
    return { progress: Math.max(0, Math.min(100, progress)), nextBadge };
  };

  const { progress, nextBadge } = getProgressToNextBadge();

  return (
    <div className="badge-system">
      <div className="badge-header">
        <h3 className="badge-title">🏆 Achievement Badges</h3>
        <div className="badge-stats">
          <span className="unlocked-count">{unlockedBadges.length}/{badges.length} Unlocked</span>
        </div>
      </div>

      {nextBadge && (
        <div className="next-badge-progress">
          <div className="progress-info">
            <span className="progress-text">
              Progress to {nextBadge.name}: {userCoins}/{nextBadge.minCoins} coins
            </span>
            <span className="progress-percentage">{progress.toFixed(0)}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${progress}%`,
                background: nextBadge.gradient
              }}
            ></div>
          </div>
        </div>
      )}

      <div className="badge-grid">
        {badges.map((badge) => {
          const isUnlocked = unlockedBadges.some(b => b.id === badge.id);
          const isActive = userCoins >= badge.minCoins && userCoins <= badge.maxCoins;
          
          return (
            <div 
              key={badge.id}
              className={`badge-card ${isUnlocked ? 'unlocked' : 'locked'} ${isActive ? 'active' : ''}`}
            >
              <div className="badge-image-container">
                <div 
                  className="badge-image"
                  style={{ 
                    background: isUnlocked ? badge.gradient : '#f0f0f0'
                  }}
                >
                  {isUnlocked ? (
                    <img src={badge.image} alt={badge.name} className="badge-svg" />
                  ) : (
                    <span className="lock-icon">🔒</span>
                  )}
                </div>
                {isActive && (
                  <div className="active-indicator">
                    <span className="pulse-dot"></span>
                    Current
                  </div>
                )}
              </div>
              
              <div className="badge-info">
                <h4 className="badge-name">{badge.name}</h4>
                <p className="badge-description">{badge.description}</p>
                <div className="badge-requirement">
                  {badge.maxCoins === Infinity ? 
                    `${badge.minCoins}+ coins` : 
                    `${badge.minCoins}-${badge.maxCoins} coins`
                  }
                </div>
              </div>
              
              {!isUnlocked && (
                <div className="badge-overlay">
                  <div className="coins-needed">
                    {badge.minCoins - userCoins} more coins needed
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showUnlockAnimation && (
        <div className="badge-unlock-modal">
          <div className="unlock-content">
            <div className="unlock-animation">
              <div className="unlock-badge" style={{ background: showUnlockAnimation.gradient }}>
                <img src={showUnlockAnimation.image} alt={showUnlockAnimation.name} className="unlock-badge-svg" />
              </div>
              <div className="unlock-sparkles">
                <span className="sparkle">✨</span>
                <span className="sparkle">⭐</span>
                <span className="sparkle">✨</span>
                <span className="sparkle">⭐</span>
              </div>
            </div>
            <h2 className="unlock-title">Badge Unlocked!</h2>
            <h3 className="unlock-badge-name">{showUnlockAnimation.name}</h3>
            <p className="unlock-description">{showUnlockAnimation.description}</p>
            <button 
              className="unlock-close"
              onClick={() => setShowUnlockAnimation(null)}
            >
              Awesome! 🎉
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgeSystem;
