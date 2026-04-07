import React from 'react';
import AnimeList from './AnimeList';
import { useTopAnime, useSeasonNow } from '../hooks/useAnime';

function Home() {
  const { data: topAnime, loading: topLoading, error: topError } = useTopAnime();
  const { data: seasonAnime, loading: seasonLoading, error: seasonError } = useSeasonNow();

  return (
    <div>
      <h1>Аниме</h1>
      <section>
        <h2>Топ аниме</h2>
        <AnimeList anime={topAnime?.data} loading={topLoading} error={topError} />
      </section>
      <section>
        <h2>Сезонные релизы</h2>
        <AnimeList anime={seasonAnime?.data} loading={seasonLoading} error={seasonError} />
      </section>
    </div>
  );
}

export default Home;