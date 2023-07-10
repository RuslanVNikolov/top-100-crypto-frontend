import React, { useState, useEffect } from 'react';
import './CryptoNews.css';

const CryptoNews = () => {
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('https://cryptonews-api.com/api/v1/category?section=general&items=10&page=1&token=klxzfmn8f9okgtp5bbxgrb4xxtqh6etb9zx1kiw9');
        const jsonData = await response.json();
        setNewsData(jsonData.data);
      } catch (error) {
        console.error('Failed to fetch news', error);
      }
    };

    fetchNews();
  }, []);

  return (
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
  );
};

export default CryptoNews;
