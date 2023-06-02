import React, { useState, useEffect, useCallback } from 'react';
import Modal from './Modal'; // Import your Modal component
import './CryptoTable.css';

const API_BASE_URL = 'http://localhost:8080';

const CryptoTable = () => {
  const [cryptos, setCryptos] = useState();
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    // Sort the data by market cap in descending order
    const sortedData = data.sort((a, b) => b.marketCap - a.marketCap);

    // Helper function to format numbers with commas as thousand separators
    const numberWithCommas = (x) => {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const currencies = sortedData.map((currency, index) => (
      <tr key={currency.id} onClick={() => handleRowClick(currency)}>
        <td>{index + 1}</td>
        <td>{currency.name}</td>
        <td>${numberWithCommas(parseFloat(currency.valueUsd).toFixed(2))}</td>
        <td>${numberWithCommas(parseFloat(currency.marketCap).toFixed(2))}</td>
        <td>{currency.change24h}</td>
      </tr>
    ));

    setCryptos(currencies);
  }, []); // Add dependencies if any functions or variables inside mapResponse are changing

  const handleRowClick = (currency) => {
    setSelectedCrypto(currency);
    setIsModalOpen(true);
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
