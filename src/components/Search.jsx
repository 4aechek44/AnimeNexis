import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AnimeCard from './AnimeCard';
import { useAnimeSearch } from '../hooks/useAnime';
import './Search.css';

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const { results, loading, error } = useAnimeSearch(query);

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    if (newQuery) {
      setSearchParams({ q: newQuery });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="search">
      <div className="search-header">
        <h1>Поиск аниме</h1>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Введите название аниме..."
          className="search-input"
          autoFocus
        />
      </div>

      {error && (
        <div className="error-message">
          <p className="error">⚠️ Ошибка: {error}</p>
        </div>
      )}

      {loading && <p className="loading">Загрузка результатов...</p>}

      {!query && !loading && (
        <p className="search-hint">Введите название аниме для поиска...</p>
      )}

      {query && !loading && results.length === 0 && !error && (
        <p className="no-results">По запросу "{query}" ничего не найдено</p>
      )}

      {results.length > 0 && (
        <div>
          <p className="results-count">Найдено результатов: {results.length}</p>
          <div className="anime-grid">
            {results.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;