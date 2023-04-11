// Portfolio.js
import React, { useState, useEffect } from 'react';
import './Portfolio.css';
import UserBalances from './UserBalances';

const Portfolio = () => {
  const [balances, setBalances] = useState([]);

  // Fetch user's crypto balances
  const fetchBalances = () => {
    // Replace this with your API call to fetch the user's balances
    const userBalances = [
      {
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'BTC',
        balance: 0.5,
      },
      {
        id: 'ethereum',
        name: 'Ethereum',
        symbol: 'ETH',
        balance: 3,
      },
    ];

    setBalances(userBalances);
  };

  useEffect(() => {
    fetchBalances();
  }, []);

  const handleOpenModal = () => {
    // Implement logic to open the modal for creating/editing balances
  };

  return (
    <div className="portfolio">
      <h2>Your Portfolio</h2>
      <UserBalances balances={balances} />
      <button className="editButton" onClick={handleOpenModal}>
        Edit Balances
      </button>
    </div>
  );
};

export default Portfolio;
