import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ApiService from '../services/api';
import './StreakCalendar.css';

const StreakCalendar = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [streakData, setStreakData] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStreakData();
    }
  }, [user, currentDate]);

  const fetchStreakData = async () => {
    try {
      setLoading(true);
      // For now, we'll simulate streak data based on user's claim history
      // In a real implementation, you'd fetch this from your backend
      const mockStreakData = generateMockStreakData();
      setStreakData(mockStreakData);
      calculateStreaks(mockStreakData);
    } catch (error) {
      console.error('Error fetching streak data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockStreakData = () => {
    const data = [];
    const today = new Date();
    
    // Generate last 30 days of data
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Simulate some streak pattern (70% chance of claiming)
      const claimed = Math.random() > 0.3;
      
      data.push({
        date: date.toISOString().split('T')[0],
        claimed,
        coins: claimed ? 10 : 0
      });
    }
    
    return data;
  };

  const calculateStreaks = (data) => {
    let current = 0;
    let longest = 0;
    let temp = 0;

    // Calculate current streak (from today backwards)
    const today = new Date().toISOString().split('T')[0];
    const sortedData = [...data].reverse();
    
    for (const day of sortedData) {
      if (day.date <= today && day.claimed) {
        current++;
      } else if (day.date <= today) {
        break;
      }
    }

    // Calculate longest streak
    for (const day of data) {
      if (day.claimed) {
        temp++;
        longest = Math.max(longest, temp);
      } else {
        temp = 0;
      }
    }

    setCurrentStreak(current);
    setLongestStreak(longest);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const streakDay = streakData.find(s => s.date === dateStr);
      
      days.push({
        day,
        date: dateStr,
        claimed: streakDay?.claimed || false,
        coins: streakDay?.coins || 0,
        isToday: dateStr === new Date().toISOString().split('T')[0]
      });
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) {
    return (
      <div className="streak-calendar-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="streak-calendar-container">
      <div className="streak-stats">
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-info">
            <div className="stat-number">{currentStreak}</div>
            <div className="stat-label">Current Streak</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-info">
            <div className="stat-number">{longestStreak}</div>
            <div className="stat-label">Longest Streak</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <div className="stat-number">{streakData.filter(d => d.claimed).length * 10}</div>
            <div className="stat-label">Total Earned</div>
          </div>
        </div>
      </div>

      <div className="calendar-header">
        <button className="nav-button" onClick={() => navigateMonth(-1)}>
          &#8249;
        </button>
        <h3 className="month-year">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button className="nav-button" onClick={() => navigateMonth(1)}>
          &#8250;
        </button>
      </div>

      <div className="calendar-grid">
        <div className="weekdays">
          {weekDays.map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>
        
        <div className="days-grid">
          {getDaysInMonth(currentDate).map((day, index) => (
            <div
              key={index}
              className={`calendar-day ${day ? 'valid-day' : 'empty-day'} ${
                day?.claimed ? 'claimed' : ''
              } ${day?.isToday ? 'today' : ''}`}
            >
              {day && (
                <>
                  <span className="day-number">{day.day}</span>
                  {day.claimed && (
                    <div className="claim-indicator">
                      <span className="check-mark">✓</span>
                      <span className="coins-earned">+{day.coins}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="calendar-legend">
        <div className="legend-item">
          <div className="legend-color claimed"></div>
          <span>Claimed</span>
        </div>
        <div className="legend-item">
          <div className="legend-color today"></div>
          <span>Today</span>
        </div>
        <div className="legend-item">
          <div className="legend-color empty"></div>
          <span>Not Claimed</span>
        </div>
      </div>
    </div>
  );
};

export default StreakCalendar;
