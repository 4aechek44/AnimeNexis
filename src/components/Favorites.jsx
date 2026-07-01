import React, { memo, useMemo } from 'react';
import { useAnimeContext } from '../hooks/useAnimeContext';
import AnimeCard from './AnimeCard';
import './Favorites.css';

function Favorites() {
  const { favorites } = useAnimeContext();
  const favoritesList = useMemo(() => favorites, [favorites]);

  if (favoritesList.length === 0) {
    return (
      <div className="empty-state">
        <h1>Favorites</h1>
        <p>You have no favorite anime</p>
        <p className="subtitle">Add anime to your favorites by clicking the 🤍 on the card</p>
      </div>
    );
  }

  return (
    <div className="favorites">
      <h1>Favorites ({favoritesList.length})</h1>
      <div className="anime-grid">
        {favoritesList.map((anime) => (
          <AnimeCard key={anime.mal_id} anime={anime} />
        ))}
      </div>
    </div>
  );
}

export default memo(Favorites);