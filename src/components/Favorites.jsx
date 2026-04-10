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
        <h1>Избранное</h1>
        <p>У вас нет избранных аниме</p>
        <p className="subtitle">Добавьте аниме в избранное, нажав на 🤍 на карточке</p>
      </div>
    );
  }

  return (
    <div className="favorites">
      <h1>Избранное ({favoritesList.length})</h1>
      <div className="anime-grid">
        {favoritesList.map((anime) => (
          <AnimeCard key={anime.mal_id} anime={anime} />
        ))}
      </div>
    </div>
  );
}

export default memo(Favorites);