import React, { memo, useMemo } from 'react';
import { useAnimeContext } from '../hooks/useAnimeContext';
import AnimeCard from './AnimeCard';
import './Plans.css';

function Plans() {
  const { plans } = useAnimeContext();
  const plansList = useMemo(() => plans, [plans]);

  if (plansList.length === 0) {
    return (
      <div className="empty-state">
        <h1>Планы на аниме</h1>
        <p>У вас нет планов на аниме</p>
        <p className="subtitle">Добавьте аниме в планы, нажав на 🕑 на карточке</p>
      </div>
    );
  }

  return (
    <div className="plans">
      <h1>В планах ({plansList.length})</h1>
      <div className="anime-grid">
        {plansList.map((anime) => (
          <AnimeCard key={anime.mal_id} anime={anime} />
        ))}
      </div>
    </div>
  );
}

export default memo(Plans);