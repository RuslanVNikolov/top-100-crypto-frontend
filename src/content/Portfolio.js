import React, { useState, useEffect, useContext, useCallback } from 'react';
import './Portfolio.css';
import UserBalances from './UserBalances';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
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
        transactions: balance.transactions.map((transaction) => ({
          amount: transaction.amount,
          price: transaction.price,
          date: transaction.date,
        })),
      }));

      setPortfolio({
        ...data,
        userBalances,
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

      setShowModal(false);
      fetchBalances();
    } catch (error) {
      console.error('Error posting transaction:', error);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const formatMoney = (value) => {
    if (value === 0) {
      return 'No Data';
    }
    const formattedValue = (value || 0).toFixed(2);
    return `$${numberWithCommas(formattedValue)}`;
  };

  let totalProfit = portfolio.userBalances.reduce((total, balance) => total + balance.profit, 0);
  let totalInvestment = portfolio.userBalances.reduce((total, balance) => total + balance.averageBuyPrice * balance.balance, 0);
  let totalProfitPercentage = totalInvestment !== 0 ? (totalProfit / totalInvestment) * 100 : 0;

  const isProfit = totalProfit >= 0;

  const getColor = (index) => {
    const red = (index * 50) % 255;
    const green = (index * 100) % 255;
    const blue = (index * 150) % 255;

    return `rgb(${red},${green},${blue})`;
  };

  let data = portfolio.userBalances.filter((balance) => balance.percentage > 0);
  let others = data.filter((balance) => balance.percentage < 1);
  let majorBalances = data.filter((balance) => balance.percentage >= 1);

  if (others.length > 0) {
    let othersTotalPercentage = others.reduce((total, b) => total + b.percentage, 0);
    majorBalances.push({ name: 'Other', percentage: othersTotalPercentage });
  }

  return (
    <div className="portfolio">
      <div className="header">
        <h2>Your Portfolio</h2>
        {totalProfit !== 0 && (
          <div className={`profit ${isProfit ? 'profit' : 'loss'}`}>
            <span className="profitLabel">{isProfit ? 'Profit: ' : 'Loss: '}</span>
            <span className="profitValue">{formatMoney(totalProfit)} ({totalProfitPercentage.toFixed(2)}%)</span>
          </div>
        )}
      </div>
      <div className="chart-container">
        <PieChart width={800} height={400}>
          <Pie
            data={majorBalances}
            dataKey="percentage"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(2)}%`}
          >
            {majorBalances.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(index)} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
      <UserBalances balances={portfolio.userBalances} />
      {portfolio.totalValue && (
        <div className="totalValue">Total Value: {formatMoney(portfolio.totalValue)}</div>
      )}
      <button className="editButton" onClick={() => setShowModal(true)}>
        Add Transaction
      </button>
      {showModal && (
        <Modal
          onClose={() => setShowModal(false)}
          name="Add Balance"
          onBalanceFormSubmit={handleBalanceFormSubmit}
          modalSize="medium"
        />
      )}
    </div>
  );
};

export default Portfolio;
