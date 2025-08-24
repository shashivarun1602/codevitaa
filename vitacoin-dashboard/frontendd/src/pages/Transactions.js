import React, { useState, useEffect } from "react";
import '../GlobalStyles.css';
import './Transactions.css';
import ApiService from '../services/api';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [refreshing, setRefreshing] = useState(false);

  const userId = '507f1f77bcf86cd799439011'; // Demo user ID

  const fetchTransactions = async (page = 1) => {
    try {
      setLoading(page === 1);
      const response = await ApiService.getUserTransactions(userId, page, 10);
      setTransactions(response.transactions || []);
      setPagination(response.pagination || {});
      setError(null);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transactions');
      // Fallback to mock data if API fails
      setTransactions([
        {
          _id: '1',
          type: 'earn',
          amount: 50,
          description: 'Quiz completion: JavaScript Basics',
          category: 'quiz',
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          type: 'earn',
          amount: 25,
          description: 'Task completion: Daily coding challenge',
          category: 'task',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          _id: '3',
          type: 'earn',
          amount: 10,
          description: 'Daily login bonus',
          category: 'bonus',
          createdAt: new Date(Date.now() - 172800000).toISOString()
        },
        {
          _id: '4',
          type: 'spend',
          amount: 15,
          description: 'Badge unlock: Silver Achiever',
          category: 'badge',
          createdAt: new Date(Date.now() - 259200000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const refreshTransactions = async () => {
    setRefreshing(true);
    await fetchTransactions(currentPage);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage]);

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'amount':
        return b.amount - a.amount;
      case 'type':
        return a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });

  const getTransactionIcon = (type, category) => {
    if (type === 'earn') {
      switch (category) {
        case 'quiz': return '🧠';
        case 'task': return '✅';
        case 'bonus': return '🎁';
        case 'badge': return '🏆';
        default: return '💰';
      }
    } else {
      switch (category) {
        case 'badge': return '🏅';
        case 'purchase': return '🛒';
        default: return '💸';
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="page-container">
      <div className="transactions-container">
        {/* Header */}
        <div className="transactions-header">
          <div className="header-content">
            <h1 className="page-title">
              💰 Transaction <span className="page-title-highlight">History</span>
            </h1>
            <p className="page-subtitle">Track all your coin earnings and spending</p>
          </div>
          <button 
            className={`refresh-btn ${refreshing ? 'refreshing' : ''}`}
            onClick={refreshTransactions}
            disabled={refreshing}
          >
            🔄 {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Filters and Controls */}
        <div className="transactions-controls">
          <div className="filter-section">
            <label className="filter-label">Filter by type:</label>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Transactions</option>
              <option value="earn">Earnings</option>
              <option value="spend">Spending</option>
            </select>
          </div>
          
          <div className="sort-section">
            <label className="sort-label">Sort by:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="type">Type</option>
            </select>
          </div>
        </div>

        {/* Transactions List */}
        <div className="transactions-content">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading transactions...</p>
            </div>
          ) : error && transactions.length === 0 ? (
            <div className="error-container">
              <p className="error-message">{error}</p>
              <button onClick={refreshTransactions} className="retry-btn">
                Try Again
              </button>
            </div>
          ) : sortedTransactions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h3>No Transactions Found</h3>
              <p>Start earning coins by completing quizzes and tasks!</p>
            </div>
          ) : (
            <div className="transactions-list">
              {sortedTransactions.map((transaction) => (
                <div 
                  key={transaction._id} 
                  className={`transaction-item ${transaction.type}`}
                >
                  <div className="transaction-icon">
                    {getTransactionIcon(transaction.type, transaction.category)}
                  </div>
                  
                  <div className="transaction-details">
                    <div className="transaction-description">
                      {transaction.description}
                    </div>
                    <div className="transaction-meta">
                      <span className="transaction-category">
                        {transaction.category || transaction.type}
                      </span>
                      <span className="transaction-date">
                        {formatDate(transaction.createdAt)} at {formatTime(transaction.createdAt)}
                      </span>
                    </div>
                  </div>
                  
                  <div className={`transaction-amount ${transaction.type}`}>
                    {transaction.type === 'earn' ? '+' : '-'}{transaction.amount}
                    <span className="coin-symbol">🪙</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                ← Previous
              </button>
              
              <div className="pagination-info">
                Page {currentPage} of {pagination.pages}
              </div>
              
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.pages))}
                disabled={currentPage === pagination.pages}
                className="pagination-btn"
              >
                Next →
              </button>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="transaction-summary">
          <div className="summary-card earn">
            <div className="summary-icon">📈</div>
            <div className="summary-info">
              <span className="summary-label">Total Earned</span>
              <span className="summary-value">
                {sortedTransactions
                  .filter(t => t.type === 'earn')
                  .reduce((sum, t) => sum + t.amount, 0)} 🪙
              </span>
            </div>
          </div>
          
          <div className="summary-card spend">
            <div className="summary-icon">📉</div>
            <div className="summary-info">
              <span className="summary-label">Total Spent</span>
              <span className="summary-value">
                {sortedTransactions
                  .filter(t => t.type === 'spend')
                  .reduce((sum, t) => sum + t.amount, 0)} 🪙
              </span>
            </div>
          </div>
          
          <div className="summary-card total">
            <div className="summary-icon">💰</div>
            <div className="summary-info">
              <span className="summary-label">Net Change</span>
              <span className="summary-value">
                {sortedTransactions.reduce((sum, t) => 
                  sum + (t.type === 'earn' ? t.amount : -t.amount), 0)} 🪙
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
