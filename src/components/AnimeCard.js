import React from 'react';
import { Link } from 'react-router-dom';
import { useAnimeContext } from '../hooks/useAnimeContext';
import './AnimeCard.css';

function AnimeCard({ anime }) {
  const { isFavorite, isInWatchlist, toggleFavorite, toggleWatchlist } = useAnimeContext();

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    toggleFavorite(anime);
  };

  const handleWatchlistClick = (e) => {
    e.preventDefault();
    toggleWatchlist(anime);
  };

  return (
    <Link to={`/anime/${anime.mal_id}`} className="anime-card">
      <div className="anime-card-image">
        <img src={anime.images?.jpg?.image_url} alt={anime.title} />
        <div className="anime-card-overlay">
          <button className={`btn-favorite ${isFavorite(anime.mal_id) ? 'active' : ''}`} onClick={handleFavoriteClick}>
            ♥
          </button>
          <button className={`btn-watchlist ${isInWatchlist(anime.mal_id) ? 'active' : ''}`} onClick={handleWatchlistClick}>
            +
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

export default AnimeCard;