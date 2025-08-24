import React from 'react';
import { useAuth } from '../context/AuthContext';
import './CoinBalance.css';

const CoinBalance = () => {
  const { user } = useAuth();

  return (
    <div className="coin-balance-container">
      <span className="coin-icon">💰</span>
      <span className="coin-amount">{user ? user.coins : 0}</span>
      <span className="coin-text">Coins</span>
    </div>
  );
};

export default CoinBalance;
