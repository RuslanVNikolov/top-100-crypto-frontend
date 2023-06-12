import React, { useState, useEffect, useCallback, useContext } from 'react';
import Modal from './Modal'; // Import your Modal component
import './CryptoTable.css';
import { AuthContext } from '../auth/AuthContext'; // path to your AuthContext

const API_BASE_URL = 'http://localhost:8080';

const CryptoTable = () => {
  const [cryptos, setCryptos] = useState();
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { authState } = useContext(AuthContext);
  const { token } = authState;

  const getCurrencyRequest = async () => {
    const fullPath = `${API_BASE_URL}/currencies/top100`;
    const response = await fetch(fullPath);
    if (!response.ok) {
      throw new Error(`Unable to fetch cryptos (${response.status} ${response.statusText})`);
    }
    const data = await response.json();
    return data;
  };

  const mapResponse = useCallback((data) => {
    const sortedData = data.sort((a, b) => b.marketCap - a.marketCap);

    const numberWithCommas = (x) => {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const currencies = sortedData.map((currency, index) => {
      let change24h = currency.change24h < 0 ? currency.change24h * -1 : currency.change24h;

      return (
        <tr key={currency.id} onClick={() => handleRowClick(currency)}>
          <td>{index + 1}</td>
          <td>{currency.name}</td>
          <td>${numberWithCommas(parseFloat(currency.valueUsd).toFixed(2))}</td>
          <td>${numberWithCommas(parseFloat(currency.marketCap).toFixed(0))}</td>
          <td className={currency.change24h < 0 ? 'red' : 'green'}>
            <img src={currency.change24h < 0 ? "/red-arrow.png" : "/green-arrow.png"} alt="change" />
            {numberWithCommas(parseFloat(change24h).toFixed(2))}
          </td>
          {token && (
            <td onClick={handleStarClick}>
              <img className="clickable-star" src="/star-empty.png" alt="star" />
            </td>
          )}
        </tr>
      );
    });

    setCryptos(currencies);
  }, [token]); // Add dependencies if any functions or variables inside mapResponse are changing

  const handleRowClick = (currency) => {
    setSelectedCrypto(currency);
    setIsModalOpen(true);
  };

  const handleStarClick = (e) => {
    e.stopPropagation();
    console.log("CLICKED!")
    // Add your functionality here
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    getCurrencyRequest().then((data) => mapResponse(data));
  }, [mapResponse]); // Add mapResponse to the dependency array

  return (
    <>
      <table className="cryptoTable">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Price</th>
            <th>Market Cap</th>
            <th>24h %</th>
            {token && <th>Favorite</th>}
          </tr>
        </thead>
        <tbody>
          {cryptos}
        </tbody>
      </table>
      {isModalOpen && <Modal onClose={closeModal} crypto={selectedCrypto} showCloseButton={true} modalSize='large' />}
    </>
  );
};

export default CryptoTable;
