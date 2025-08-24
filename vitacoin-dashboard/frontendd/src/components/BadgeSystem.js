import React, { useState, useEffect } from 'react';
import './BadgeSystem.css';

const BadgeSystem = ({ coins = 0, onBadgeUnlock }) => {
  const [badgeImages, setBadgeImages] = useState({});
  const [unlockedBadges, setUnlockedBadges] = useState([]);
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(null);
  const userCoins = coins;

  // Load custom badge images
  useEffect(() => {
    const loadBadgeImages = async () => {
      const images = {};
      const badgeTypes = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];
      
      for (const type of badgeTypes) {
        try {
          // Try to import custom images from assets/badges folder
          const image = await import(`../assets/badges/${type}.png`);
          images[type] = image.default;
        } catch (error) {
          try {
            // Fallback to .jpg
            const image = await import(`../assets/badges/${type}.jpg`);
            images[type] = image.default;
          } catch (jpgError) {
            // Use default emoji if no custom image found
            images[type] = null;
          }
        }
      }
      setBadgeImages(images);
    };

    loadBadgeImages();
  }, []);

  const getBadgeLevel = (coins) => {
    if (coins >= 1000) return { level: 5, name: 'Diamond', color: '#b9f2ff', icon: '💎', type: 'diamond' };
    if (coins >= 600) return { level: 4, name: 'Platinum', color: '#e5e4e2', icon: '🏆', type: 'platinum' };
    if (coins >= 300) return { level: 3, name: 'Gold', color: '#ffd700', icon: '🥇', type: 'gold' };
    if (coins >= 100) return { level: 2, name: 'Silver', color: '#c0c0c0', icon: '🥈', type: 'silver' };
    return { level: 1, name: 'Bronze', color: '#cd7f32', icon: '🥉', type: 'bronze' };
  };

  const renderBadgeIcon = (badge) => {
    const customImage = badgeImages[badge.type];
    if (customImage) {
      return <img src={customImage} alt={badge.name} className="badge-custom-image" />;
    }
    return <span className="badge-emoji">{badge.icon}</span>;
  };

  const badges = [
    {
      id: 1,
      name: "Bronze Explorer",
      description: "Earned your first 100 coins",
      minCoins: 100,
      maxCoins: 299,
      type: 'bronze',
      color: "#CD7F32",
      gradient: "linear-gradient(135deg, #CD7F32 0%, #8B4513 100%)"
    },
    {
      id: 2,
      name: "Silver Achiever", 
      description: "Reached 300 coins milestone",
      minCoins: 300,
      maxCoins: 599,
      type: 'silver',
      color: "#C0C0C0",
      gradient: "linear-gradient(135deg, #C0C0C0 0%, #808080 100%)"
    },
    {
      id: 3,
      name: "Gold Master",
      description: "Accumulated 600 coins",
      minCoins: 600,
      maxCoins: 999,
      type: 'gold',
      color: "#FFD700",
      gradient: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)"
    },
    {
      id: 4,
      name: "Platinum Elite",
      description: "Reached 1000 coins milestone",
      minCoins: 1000,
      maxCoins: 1999,
      type: 'platinum',
      color: "#E5E4E2",
      gradient: "linear-gradient(135deg, #E5E4E2 0%, #C0C0C0 100%)"
    },
    {
      id: 5,
      name: "Diamond Champion",
      description: "Achieved 2000+ coins",
      minCoins: 2000,
      maxCoins: Infinity,
      type: 'diamond',
      color: "#00BFFF",
      gradient: "linear-gradient(135deg, #00BFFF 0%, #0080FF 100%)"
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
              
              <div className="badge-icon-display">
                {renderBadgeIcon(badge)}
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
                {renderBadgeIcon(showUnlockAnimation)}
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
