import React, { useState, useEffect, useContext, useCallback } from 'react';
import './Portfolio.css';
import UserBalances from './UserBalances';
import Modal from './Modal';
import { AuthContext } from '../auth/AuthContext';

const API_URL = 'http://localhost:8080/portfolios';

const Portfolio = () => {
  const [balances, setBalances] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { authState } = useContext(AuthContext);
  const { token } = authState;

  const fetchBalances = useCallback(async () => {
    try {
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);

      const response = await fetch(`${API_URL}`, { headers });
      const data = await response.json();

      const userBalances = data.userBalances.map((balance) => ({
        id: balance.currency.id,
        name: balance.currency.name,
        symbol: balance.currency.shortName,
        balance: parseFloat(balance.totalAmount),
      }));

      setBalances(userBalances);
    } catch (error) {
      console.error('Error fetching user balances:', error);
    }
  }, [token]);

  const handleBalanceFormSubmit = async (formData) => {
    try {
      // Here, you would typically make a POST request to your server to update the user's balances
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      headers.append('Content-Type', 'application/json');
  
      const response = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error(`Unable to post transaction (${response.status} ${response.statusText})`);
      }
  
      const data = await response.json();
      console.log(data)
  
      // After successfully posting the transaction, close the modal and re-fetch the balances
      setShowModal(false);
      fetchBalances();
    } catch (error) {
      console.error('Error posting transaction:', error);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  return (
    <div className="portfolio">
      <h2>Your Portfolio</h2>
      <UserBalances balances={balances} />
      <button className="editButton" onClick={() => setShowModal(true)}>
        Add Transaction
      </button>
      {showModal && (
        <Modal
          onClose={() => setShowModal(false)}
          name="Add Balance"
          onBalanceFormSubmit={handleBalanceFormSubmit}
          modalSize='medium'
        />
      )}
    </div>
  );
};

export default Portfolio;
