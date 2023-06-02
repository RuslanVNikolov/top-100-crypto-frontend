import React, { useEffect, useState } from 'react';
import { LineChart, XAxis, YAxis, Tooltip, CartesianGrid, Line } from 'recharts';
import BalanceForm from './BalanceForm';
import './Modal.css';

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

const modalSizeToClassName = {
  small: 'modal-small',
  medium: 'modal-medium',
  large: 'modal-large',
};

const Modal = ({ onClose, crypto, name, children, showCloseButton, onBalanceFormSubmit, modalSize }) => {

  const headerText = crypto ? crypto.name : name;
  const [historicalData, setHistoricalData] = useState(null);

  const cryptoInfo = crypto ? (
    <>
      <p>Price: ${crypto.valueUsd}</p>
      <p>Market Cap: ${crypto.marketCap}</p>
      <p>24h Change: {crypto.change24h}%</p>
      {historicalData && (
        <div className="chartContainer">
          <LineChart width={760} height={300} data={historicalData}>
            <XAxis dataKey="timestamp" tickFormatter={formatDate} />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip labelFormatter={formatDate} />
            <CartesianGrid stroke="#f5f5f5" />
            <Line type="monotone" dataKey="valueUsd" stroke="#ff7300" yAxisId={0} />
          </LineChart>
        </div>
      )}
    </>
  ) : (
    children
  );

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  useEffect(() => {
    if (crypto) {
      const fetchHistoricalData = async () => {
        try {
          const response = await fetch(`http://localhost:8080/currencies/history?cmcId=${crypto.cmcId}`);
          const data = await response.json();
          setHistoricalData(data);
          console.log('Historical data fetched:', data);
        } catch (error) {
          console.error('Error fetching historical data:', error);
        }
      };

      fetchHistoricalData();
    }
  }, [crypto]);

  return (
    <div className="backdrop">
      <div className={`modal ${modalSizeToClassName[modalSize]}`}>
        <div className="modalHeader">
          <h2>{headerText}</h2>
          <button className="closeButton" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modalBody">{onBalanceFormSubmit ? <BalanceForm onSubmit={onBalanceFormSubmit} /> : cryptoInfo}</div>
        <div className={`modalFooter${crypto ? '' : ' modalFooterWithoutButton'}`}>
          {showCloseButton && crypto && (
            <button className="closeButtonGreen" onClick={onClose}>
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


Modal.defaultProps = {
  showCloseButton: true,
  modalSize: 'medium',
};

export default Modal;