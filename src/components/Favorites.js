import React from 'react';
import { useAnimeContext } from '../hooks/useAnimeContext';
import AnimeCard from './AnimeCard';
import './Favorites.css';

function Favorites() {
  const { favorites } = useAnimeContext();

  if (favorites.length === 0) {
    return (
      <div className="empty-state">
        <h1>Избранное</h1>
        <p>У вас нет избранных аниме</p>
        <p className="subtitle">Добавьте аниме в избранное, нажав на ❤️ на карточке</p>
      </div>
    );
  }

  return (
    <div className="favorites">
      <h1>Избранное ({favorites.length})</h1>
      <div className="anime-grid">
        {favorites.map((anime) => (
          <AnimeCard key={anime.mal_id} anime={anime} />
        ))}
      </div>
    </div>
  );
}

export default Favorites;