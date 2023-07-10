import React, { useState, useEffect, useContext, useCallback } from 'react';
import Modal from './Modal';
import './CryptoTable.css';
import { AuthContext } from '../auth/AuthContext';

const API_BASE_URL = 'http://localhost:8080';

const Favorites = () => {
  const [cryptos, setCryptos] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newsData, setNewsData] = useState([]);

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
    const favoriteCurrencies = data.filter(userCurrency => userCurrency.favorite);
    const shortNames = favoriteCurrencies.map(userCurrency => userCurrency.currency.shortName);
    const cryptoNames = shortNames.join(',');
    mapResponse(favoriteCurrencies.map(userCurrency => userCurrency.currency));
    return cryptoNames;
  }, [token]);

  const getCryptoNews = useCallback(async (cryptoNames) => {
    try {
      const response = await fetch(`https://cryptonews-api.com/api/v1?tickers=${cryptoNames}&items=3&page=1&token=klxzfmn8f9okgtp5bbxgrb4xxtqh6etb9zx1kiw9`);
      const jsonData = await response.json();
      setNewsData(jsonData.data);
    } catch (error) {
      console.error('Failed to fetch news', error);
    }
  }, []);

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
    getFavoriteCurrenciesRequest().then((cryptoNames) => {
      getCryptoNews(cryptoNames);
    });
  }, [getFavoriteCurrenciesRequest, getCryptoNews]);

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
      <div className="cryptoNewsContainer">
        {newsData.map((newsItem, index) => (
          <div className="newsItem" key={newsItem.news_url} onClick={() => window.open(newsItem.news_url, "_blank")}>
            <img className="thumbnail" src={newsItem.image_url} alt={newsItem.title} />
            <div className="content">
              <h2 className="title">{newsItem.title}</h2>
              <p className="description">{newsItem.text.length > 400 ? `${newsItem.text.substring(0, 400)}...` : newsItem.text}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Favorites;
