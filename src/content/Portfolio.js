import React, { useState, useEffect, useContext, useCallback } from 'react';
import './Portfolio.css';
import UserBalances from './UserBalances';
import Modal from './Modal';
import { AuthContext } from '../auth/AuthContext';

const API_URL = 'http://localhost:8080/portfolios';

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState({ userBalances: [] });
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
        id: balance.currency.shortName,
        name: balance.currency.name,
        symbol: balance.currency.shortName,
        price: parseFloat(balance.currency.valueUsd),
        balance: parseFloat(balance.amount),
        percentage: parseFloat(balance.percentage),
        profit: parseFloat(balance.profit),
        profitPercentage: parseFloat(balance.profitPercentage),
        averageBuyPrice: parseFloat(balance.averageBuyPrice),
        totalValue: parseFloat(balance.totalValue),
        transactions: balance.transactions.map(transaction => ({
          amount: transaction.amount,
          price: transaction.price,
          date: transaction.date
        }))
      }));

      console.log(userBalances)

      setPortfolio({
        ...data,
        userBalances
      });
    } catch (error) {
      console.error('Error fetching user balances:', error);
    }
  }, [token]);

  const handleBalanceFormSubmit = async (formData) => {
    try {
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

  const isProfit = portfolio.profit >= 0;

  return (
    <div className="portfolio">
      <div className="header">
        <h2>Your Portfolio</h2>
        <div className={`profit ${isProfit ? 'profit' : 'loss'}`}>
          <span className="profitLabel">{isProfit ? 'Profit: ' : 'Loss: '}</span>
          <span className="profitAmount">${Math.abs(portfolio.profit || 0).toFixed(2)}</span>
          <span className="profitPercentage">({Math.abs(portfolio.profitPercentage || 0).toFixed(2)}%)</span>
        </div>
      </div>
      <UserBalances balances={portfolio.userBalances} />
      <div className="totalValue">Total Value: ${(portfolio.totalValue || 0).toFixed(2)}</div>
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
