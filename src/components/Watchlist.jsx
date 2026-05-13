import React, { memo, useMemo } from 'react';
import { useAnimeContext } from '../hooks/useAnimeContext';
import AnimeCard from './AnimeCard';
import './Watchlist.css';

function Watchlist() {
  const { watchlist } = useAnimeContext();
  const watchlistItems = useMemo(() => watchlist, [watchlist]);

  if (watchlistItems.length === 0) {
    return (
      <div className="empty-state">
        <h1>Просмотренно</h1>
        <p>Ваш список пуст</p>
        <p className="subtitle">Добавьте аниме в список, нажав на 👁️ на карточке</p>
      </div>
    );
  }

  return (
    <div className="watchlist">
      <h1>К просмотру ({watchlistItems.length})</h1>
      <div className="anime-grid">
        {watchlistItems.map((anime) => (
          <AnimeCard key={anime.mal_id} anime={anime} />
        ))}
      </div>
    </div>
  );
}

export default memo(Watchlist);