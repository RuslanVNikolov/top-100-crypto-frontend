import React, { useState, useEffect, useContext, useCallback } from 'react';
import Modal from './Modal';
import './CryptoTable.css';
import { AuthContext } from '../auth/AuthContext';

const API_BASE_URL = 'http://localhost:8080';

const Favorites = () => {
  const [cryptos, setCryptos] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { authState } = useContext(AuthContext);
  const { token } = authState;

  const getFavoriteCurrenciesRequest = useCallback(async () => {
    const fullPath = `${API_BASE_URL}/user-currencies`;
    const response = await fetch(fullPath, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Unable to fetch favorite cryptos (${response.status} ${response.statusText})`);
    }
    const data = await response.json();
    return data.filter(userCurrency => userCurrency.favorite).map(userCurrency => userCurrency.currency);
  }, [token]);

  const handleStarClick = useCallback(async (e, cmcId) => {
    e.stopPropagation();

    try {
      const response = await fetch(`${API_BASE_URL}/user-currencies/favorite?cmcId=${cmcId}&favorite=false`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to unfavorite');
      }

      // Refresh favorite currencies after unfavorite
      const favoriteCurrencies = await getFavoriteCurrenciesRequest();
      mapResponse(favoriteCurrencies);
    } catch (error) {
      console.error(error);
    }
  }, [token, getFavoriteCurrenciesRequest]);

  const mapResponse = useCallback((data) => {
    const sortedData = data.sort((a, b) => b.marketCap - a.marketCap);

    const numberWithCommas = (x) => {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const handleRowClick = (currency) => {
      setSelectedCrypto(currency);
      setIsModalOpen(true);
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
          <td>
            <img
              className="clickable-star"
              src="/star-full.png"
              alt="star"
              onClick={(e) => handleStarClick(e, currency.cmcId)}
            />
          </td>
        </tr>
      );
    });

    setCryptos(currencies);
  }, [handleStarClick]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    getFavoriteCurrenciesRequest().then((data) => mapResponse(data));
  }, [getFavoriteCurrenciesRequest, mapResponse]);

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
            <th></th>
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

export default Favorites;
