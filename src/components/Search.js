import React, { useState } from 'react';
import AnimeList from './AnimeList';
import { useAnimeSearch } from '../hooks/useAnime';

function Search() {
  const [query, setQuery] = useState('');
  const { results, loading, error } = useAnimeSearch(query);

  return (
    <div>
      <h1>Поиск аниме</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Введите название аниме"
      />
      <AnimeList anime={results} loading={loading} error={error} />
    </div>
  );
}

export default Search;