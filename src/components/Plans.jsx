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
        <h1>Plans</h1>
        <p>You have no plans</p>
        <p className="subtitle">Add anime to your plans by clicking the 🕑 icon on the card</p>
      </div>
    );
  }

  return (
    <div className="plans">
      <h1>Plans ({plansList.length})</h1>
      <div className="anime-grid">
        {plansList.map((anime) => (
          <AnimeCard key={anime.mal_id} anime={anime} />
        ))}
      </div>
    </div>
  );
}

export default memo(Plans);