import React, { useState, useEffect } from 'react';
import './Portfolio.css';
import UserBalances from './UserBalances';
import { AuthContext } from '../auth/AuthContext';
import { useContext } from 'react';


const API_URL = 'http://localhost:8080/portfolios';

const Portfolio = () => {
  const [balances, setBalances] = useState([]);
  const { authState } = useContext(AuthContext);
  const { token } = authState;
  console.log("DA TOKEN " + token)

  // Fetch user's crypto balances
  const fetchBalances = async () => {
    try {
      // Include the token in the Bearer authorization header
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
  
      // Make the fetch request with the headers
      const response = await fetch(`${API_URL}`, { headers });
      const data = await response.json();
  
      const userBalances = data.userBalances.map((balance) => ({
        id: balance.currency.id,
        name: balance.currency.name,
        symbol: balance.currency.shortName,
        balance: parseFloat(balance.amount),
      }));
  
      setBalances(userBalances);
    } catch (error) {
      console.error('Error fetching user balances:', error);
    }
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
