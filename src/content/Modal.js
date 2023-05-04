import React from 'react';
import './Modal.css';

const Modal = ({ onClose, crypto }) => {
  return (
    <div className="backdrop">
      <div className="modal">
        <div className="modalHeader">
          <h2>{crypto.name}</h2>
          <button className="closeButton" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modalBody">
          <p>Price: ${crypto.valueUsd}</p>
          <p>Market Cap: ${crypto.marketCap}</p>
          <p>24h Change: {crypto.change24h}%</p>
        </div>
        <div className="modalFooter">
          <button className="closeButtonGreen" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
