import React, { useEffect } from 'react';
import './Modal.css';

const Modal = ({ onClose, crypto, name, children, showCloseButton }) => {
  const headerText = crypto ? crypto.name : name;

  const cryptoInfo = crypto ? (
    <>
      <p>Price: ${crypto.valueUsd}</p>
      <p>Market Cap: ${crypto.marketCap}</p>
      <p>24h Change: {crypto.change24h}%</p>
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

  return (
    <div className="backdrop">
      <div className="modal">
        <div className="modalHeader">
          <h2>{headerText}</h2>
          <button className="closeButton" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modalBody">{cryptoInfo}</div>
        <div className={`modalFooter${showCloseButton ? '' : ' modalFooterWithoutButton'}`}>
          {showCloseButton && (
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
};

export default Modal;
