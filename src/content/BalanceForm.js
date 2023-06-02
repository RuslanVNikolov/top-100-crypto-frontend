import React, { useState } from 'react';
import './BalanceForm.css';

const BalanceForm = ({ onSubmit }) => {
  const [symbol, setSymbol] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');

  // Get today's date in the format "yyyy-mm-dd"
  const today = new Date();
  const maxDate = today.toISOString().split("T")[0];

  const handleSubmit = (event) => {
    event.preventDefault();
  
    // Get the current time and append it to the date
    const currentDateTime = new Date();
    const currentTime = currentDateTime.toTimeString().split(' ')[0];
    const dateTime = `${date}T${currentTime}`;
  
    onSubmit({ symbol, price, date: dateTime, amount });
  };
  
  return (
    <form onSubmit={handleSubmit} className="balanceForm">
      <div className="inputGroup">
        <label htmlFor="symbol">Symbol:</label>
        <input type="text" id="symbol" value={symbol} onChange={e => setSymbol(e.target.value)} />
      </div>
      <div className="inputGroup">
        <label htmlFor="price">Price:</label>
        <input type="text" id="price" value={price} onChange={e => setPrice(e.target.value)} />
      </div>
      <div className="inputGroup">
        <label htmlFor="date">Date:</label>
        <input type="date" id="date" value={date} max={maxDate} onChange={e => setDate(e.target.value)} />
      </div>
      <div className="inputGroup">
        <label htmlFor="amount">Amount:</label>
        <input type="text" id="amount" value={amount} onChange={e => setAmount(e.target.value)} />
      </div>
      <button type="submit" className="loginButton">Submit</button>
    </form>
  );
};

export default BalanceForm;
