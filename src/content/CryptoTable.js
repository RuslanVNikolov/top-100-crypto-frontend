import React, { useState, useEffect, useCallback, useContext } from 'react';
import Modal from './Modal';
import './CryptoTable.css';
import { AuthContext } from '../auth/AuthContext';

const API_BASE_URL = 'http://localhost:8080';

const CryptoTable = () => {
  const [cryptos, setCryptos] = useState();
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [userCurrencies, setUserCurrencies] = useState([]);
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

  const fetchUserCurrencies = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/user-currencies`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user currencies');
      }

      const data = await response.json();
      setUserCurrencies(data);
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  const isFavorite = useCallback((cmcId) => {
    return userCurrencies.some(
      (userCurrency) =>
        userCurrency.currency.cmcId === cmcId && userCurrency.favorite
    );
  }, [userCurrencies]);

  const mapResponse = useCallback((data) => {
    const sortedData = data.sort((a, b) => b.marketCap - a.marketCap);

    const numberWithCommas = (x) => {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const handleRowClick = (currency) => {
      setSelectedCrypto(currency);
      setIsModalOpen(true);
    };

    const handleStarClick = async (e, cmcId, isCurrentlyFavorite) => {
      e.stopPropagation();

      try {
        const response = await fetch(`${API_BASE_URL}/user-currencies/favorite`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${token}`,
          },
          body: new URLSearchParams({
            cmcId,
            favorite: !isCurrentlyFavorite,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to toggle favorite status');
        }

        fetchUserCurrencies();
      } catch (error) {
        console.error(error);
      }
    };

    const currencies = sortedData.map((currency, index) => {
      let change24h = currency.change24h < 0 ? currency.change24h * -1 : currency.change24h;
      const isCurrencyFavorite = isFavorite(currency.cmcId);

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
            <td onClick={(e) => handleStarClick(e, currency.cmcId, isCurrencyFavorite)}>
              <img
                className="clickable-star"
                src={isCurrencyFavorite ? "/star-full.png" : "/star-empty.png"}
                alt="star"
              />
            </td>
          )}
        </tr>
      );
    });

    setCryptos(currencies);
  }, [token, fetchUserCurrencies, isFavorite]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    getCurrencyRequest().then((data) => mapResponse(data));
    fetchUserCurrencies();
  }, [mapResponse, fetchUserCurrencies]);

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
