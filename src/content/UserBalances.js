import React, { useState } from 'react';
import './UserBalances.css';

const UserBalances = ({ balances }) => {
  const [selectedBalance, setSelectedBalance] = useState(null);
  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const formatMoney = (value) => value === 0 ? 'No Data' : `$${numberWithCommas((value || 0).toFixed(2))}`;
  const formatProfit = (value) => value === 0 ? 'N/A' : `$${numberWithCommas((value || 0).toFixed(2))}`;

  return (
    <table className="userBalances">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Symbol</th>
          <th>Price</th>
          <th>Balance</th>
          <th>% of Total</th>
          <th>Profit</th>
          <th>Profit %</th>
          <th>Avg. Buy Price</th>
          <th>Total Value</th>
          <th></th> {/* empty header for transactions */}
        </tr>
      </thead>
      <tbody>
        {balances.map((balance, index) => (
          <React.Fragment key={balance.id}>
            <tr onClick={() => setSelectedBalance(balance.id === selectedBalance ? null : balance.id)}>
              <td>{index + 1}</td>
              <td>{balance.name}</td>
              <td>{balance.symbol}</td>
              <td>{formatMoney(balance.price)}</td>
              <td>{numberWithCommas(balance.balance)}</td>
              <td>{(balance.percentage || 0).toFixed(2)}%</td>
              <td>{formatProfit(balance.profit)}</td>
              <td>{balance.profitPercentage === 0 ? 'N/A' : `${(balance.profitPercentage || 0).toFixed(2)}%`}</td>
              <td>{formatMoney(balance.averageBuyPrice)}</td>
              <td>{formatMoney(balance.totalValue)}</td>
              <td>
                {selectedBalance === balance.id 
                  ? <img src="/up-arrow.png" alt="Hide Transactions" /> 
                  : <img src="/down-arrow.png" alt="Show Transactions" />
                }
              </td>
            </tr>
            {selectedBalance === balance.id && (
              <tr>
                <td></td>
                <td colSpan="8">
                  <table className="innerTable">
                    <thead>
                      <tr>
                        <th>Amount</th>
                        <th>Price</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {balance.transactions.map((transaction, i) => (
                        <tr key={i}>
                          <td>{transaction.amount}</td>
                          <td>{formatMoney(transaction.price)}</td>
                          <td>{new Date(transaction.date).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default UserBalances;
