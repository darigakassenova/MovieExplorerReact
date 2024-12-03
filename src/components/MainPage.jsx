import React from 'react';
import '../index.css';
import { posterImage } from '../assets/mainPage';
import MovieCategories from './MovieCategories';
import { useTranslation } from 'react-i18next';

const MainPage = () => {
  const { t } = useTranslation();

  const categories = [
    { name: 'Now Playing', endpointKey: 'now_playing'},
    { name: 'Upcoming', endpointKey: 'upcoming' },
    { name: 'Trending Now', endpointKey: 'trending' },
    { name: 'Popular', endpointKey: 'popular' },
    { name: 'Top Rated', endpointKey: 'top_rated' },
  ];

  return (
    <div className="main-page">
      <div className="poster-container">
        <img src={posterImage} alt="Main Poster" className="poster-image" />
        <div className="overlay"></div>
      </div>
      <div className="content">
        <h1>
          <span className="unlimite">{t('welcome_span')}</span> {t('welcome')}
        </h1>
        <p>Explore a wide selection of movies, trailers, and more!</p>
      </div>
      {/* Render Movie Categories */}
      {categories.map((category, index) => (
        <MovieCategories
          key={index}
          category={category.name}
          endpointKey={category.endpointKey}
        />
      ))}
    </div>
  );
};

export default MainPage;
