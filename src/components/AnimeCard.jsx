import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { useAnimeContext } from '../hooks/useAnimeContext';
import './AnimeCard.css';

function AnimeCard({ anime }) {
  const { isFavorite, isInWatchlist, isInPlans, toggleFavorite, toggleWatchlist, togglePlans } = useAnimeContext();

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    toggleFavorite(anime);
  };

  const handleWatchlistClick = (e) => {
    e.preventDefault();
    toggleWatchlist(anime);
  };

  const handlePlansClick = (e) => {
    e.preventDefault();
    togglePlans(anime);
  };

  return (
    <Link to={`/anime/${anime.mal_id}`} className="anime-card">
      <div className="anime-card-image">
        <img src={anime.images?.jpg?.image_url} alt={anime.title} loading="lazy" />
        <div className="anime-card-overlay">
          <button className={`overlay-btn ${isFavorite(anime.mal_id) ? 'active' : ''}`} onClick={handleFavoriteClick} title="В избранное">
            <svg viewBox="0 0 24 24" fill={isFavorite(anime.mal_id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
          <button className={`overlay-btn ${isInWatchlist(anime.mal_id) ? 'active' : ''}`} onClick={handleWatchlistClick} title="Смотрю">
            <svg viewBox="0 0 24 24" fill={isInWatchlist(anime.mal_id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3" fill={isInWatchlist(anime.mal_id) ? 'white' : 'none'}/>
            </svg>
          </button>
          <button className={`overlay-btn btn-plans ${isInPlans(anime.mal_id) ? 'active' : ''}`} onClick={handlePlansClick} title="В планах">
            <svg viewBox="0 0 24 24" fill={isInPlans(anime.mal_id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </button>
        </div>
      </div>
      <div className="anime-card-content">
        <h3>{anime.title}</h3>
        <p className="anime-year">{anime.aired?.prop?.from?.year || 'N/A'}</p>
        <p className="anime-score">⭐ {anime.score || 'N/A'}</p>
        <p className="anime-type">{anime.type || 'Unknown'}</p>
      </div>
    </Link>
  );
}

export default memo(AnimeCard);