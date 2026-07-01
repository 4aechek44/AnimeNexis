import React, { useState, useEffect, memo } from 'react';
import AnimeCard from './AnimeCard';
import { useTopAnime, useSeasonNow } from '../hooks/useAnime';
import './Home.css';

function Home() {
  const [topType, setTopType] = useState('all');
  const [topPage, setTopPage] = useState(1);
  const [topAnimeList, setTopAnimeList] = useState([]);

  const [seasonPage, setSeasonPage] = useState(1);
  const [seasonAnimeList, setSeasonAnimeList] = useState([]);

  const { data: topAnime, loading: topLoading } = useTopAnime(topPage, topType);
  const { data: seasonAnime, loading: seasonLoading } = useSeasonNow(seasonPage);

  const filterHentai = (list) =>
  list.filter(anime => {
    const rating = anime.rating || '';
    return !rating.includes('Rx') && !rating.toLowerCase().includes('hentai');
  });

  useEffect(() => {
    setTopAnimeList([]);
    setTopPage(1);
  }, [topType]);

useEffect(() => {
  if (topAnime?.data) {
    const filtered = filterHentai(topAnime.data);
    setTopAnimeList(prev => {
      const combined = topPage === 1 ? filtered : [...prev, ...filtered];
      const unique = combined.filter((anime, index, self) =>
        index === self.findIndex(a => a.mal_id === anime.mal_id)
      );
      return topPage === 1 ? unique.slice(0, 24) : unique;
    });
  }
}, [topAnime]);

useEffect(() => {
  if (seasonAnime?.data) {
    const filtered = filterHentai(seasonAnime.data);
    setSeasonAnimeList(prev => {
      const combined = seasonPage === 1 ? filtered : [...prev, ...filtered];
      const unique = combined.filter((anime, index, self) =>
        index === self.findIndex(a => a.mal_id === anime.mal_id)
      );
      return seasonPage === 1 ? unique.slice(0, 24) : unique;
    });
  }
}, [seasonAnime]);

  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to NEXIS</h1>
        <p>Find your favorite anime</p>
      </div>

      <section className="section">
        <div className="section-header">
          <h2>Top Anime</h2>
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
  {topAnimeList.map((anime, index) => (
    <AnimeCard key={`${anime.mal_id}-${index}`} anime={anime} />
  ))}
  {topLoading && <p className="loading">Loading...</p>}
</div>

        <button
          className="load-more-btn"
          onClick={() => setTopPage(p => p + 1)}
          disabled={topLoading}
        >
          {topLoading ? 'Loading...' : 'Load More'}
        </button>
      </section>

      <section className="section">
        <h2>Seasonal Releases</h2>
        <div className="anime-grid">
  {seasonAnimeList.map((anime, index) => (
    <AnimeCard key={`${anime.mal_id}-${index}`} anime={anime} />
  ))}
  {seasonLoading && <p className="loading">Loading...</p>}
</div>

        <button
          className="load-more-btn"
          onClick={() => setSeasonPage(p => p + 1)}
          disabled={seasonLoading}
        >
          {seasonLoading ? 'Loading...' : 'Load More'}
        </button>
      </section>
    </div>
  );
}

export default memo(Home);