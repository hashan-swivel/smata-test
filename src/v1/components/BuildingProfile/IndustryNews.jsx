import React, { useState, useEffect } from 'react';
import Parser from 'rss-parser';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import './IndustryNews.module.scss';

export const IndustryNews = ({ windowWidth, isMobile }) => {
  const [loading, setLoading] = useState(true);
  const [newsItems, setNewsItems] = useState();
  const [showContent, setShowContent] = useState(true);
  const parser = new Parser();

  useEffect(() => {
    getFeed();
  }, []);

  // Toggle state to show/hide data when mobile view
  const toggleShowContent = () => {
    if (showContent) {
      setShowContent(false);
    } else setShowContent(true);
  };

  const getFeed = async () => {
    await parser
      .parseURL('https://cors-anywhere.herokuapp.com/https://www.realestate.com.au/news/feed/')
      .then((res) => setNewsItems(res.items))
      .then(setLoading(false))
      .catch((err) => console.log(err));
  };

  useEffect(() => {}, [newsItems]);

  // Maps through items (newItems, passed in as the prop 'items' to the AliceCarousel JSX call in render) and formulates visualisations using their data
  const itemsToElements = (items) =>
    items.map((item) => (
      <div key={item.title} className='single-industry-article'>
        <div className='article-information-container'>
          <div className='subtitle article-title'>{item.title}</div>
          <div className='article-category'>
            {Array.isArray(item.categories) ? item.categories[0] : item.categories}
          </div>
          <div className='article-description'>{item.contentSnippet}</div>
          <a
            target='_blank'
            rel='noopener noreferrer'
            href={item.link}
            className='article-read-link'
          >
            Read more
          </a>
        </div>
      </div>
    ));

  // Set how many upcoming noticeboard items to display per page depending on screen width
  const responsive = {
    0: { items: 1 },
    660: { items: 2 },
    1024: { items: 3 }
  };

  if (!loading && newsItems) {
    return (
      <div className='industry-news-container'>
        <div className='mobile-view-header'>
          <h3 className='building-title-margin building-title-heading'>Industry News</h3>
        </div>
        {/* <div className={`industry-news-grid ${showContent ? 'active' : 'inactive'}`}>
          {currentItems.map(item => (
            <div key={item.title} className="single-industry-article">
              <div className="article-information-container">
                <div className="subtitle article-title">{item.title}</div>
                <div className="article-category">
                  {Array.isArray(item.categories) ? item.categories[0] : item.categories}
                </div>
                <div className="article-description">{item.contentSnippet}</div>
                <a target="_blank" rel="noopener noreferrer" href={item.link} className="article-read-link">
                  Read more
                </a>
              </div>
            </div>
          ))}
        </div> */}
        <div className={`industry-news-grid ${showContent ? 'active' : 'inactive'}`}>
          <AliceCarousel
            mouseTrackingEnabled
            preventEventOnTouchMove
            responsive={responsive}
            dotsDisabled
            items={itemsToElements(newsItems)}
            autoPlayInterval={7000}
            autoPlay
            infinite
          />
        </div>
      </div>
    );
  }
  return null;
};
