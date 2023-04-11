// UserBalances.js
import React from 'react';
import './UserBalances.css';

const UserBalances = ({ balances }) => {
  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <table className="userBalances">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Symbol</th>
          <th>Balance</th>
        </tr>
      </thead>
      <tbody>
        {balances.map((balance, index) => (
          <tr key={balance.id}>
            <td>{index + 1}</td>
            <td>{balance.name}</td>
            <td>{balance.symbol}</td>
            <td>{numberWithCommas(balance.balance)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserBalances;
