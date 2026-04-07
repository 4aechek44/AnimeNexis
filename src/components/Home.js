import React, { useState } from 'react';
import AnimeCard from './AnimeCard';
import { useTopAnime, useSeasonNow } from '../hooks/useAnime';
import './Home.css';

function Home() {
  const [topType, setTopType] = useState('all');
  const { data: topAnime, loading: topLoading } = useTopAnime(1, topType);
  const { data: seasonAnime, loading: seasonLoading } = useSeasonNow(1);

  return (
    <div className="home">
      <div className="hero">
        <h1>Добро пожаловать в NEXIS</h1>
        <p>Найди своё любимое аниме</p>
      </div>

      <section className="section">
        <div className="section-header">
          <h2>Топ аниме</h2>
          <div className="filter-buttons">
            {['all', 'tv', 'movie', 'special'].map((type) => (
              <button
                key={type}
                className={`filter-btn ${topType === type ? 'active' : ''}`}
                onClick={() => setTopType(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="anime-grid">
          {topLoading ? (
            <p className="loading">Загрузка...</p>
          ) : (
            topAnime?.data?.slice(0, 12).map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))
          )}
        </div>
      </section>

      <section className="section">
        <h2>Сезонные релизы</h2>
        <div className="anime-grid">
          {seasonLoading ? (
            <p className="loading">Загрузка...</p>
          ) : (
            seasonAnime?.data?.slice(0, 12).map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;