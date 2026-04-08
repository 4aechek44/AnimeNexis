import React, { useState, useEffect, memo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import AnimeCard from './AnimeCard';
import { useAnimeSearch } from '../hooks/useAnime';
import './Search.css';

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const { results, loading, error } = useAnimeSearch(query);

  useEffect(() => {
    if (query) {
      setSearchParams({ q: query });
    }
  }, [query, setSearchParams]);

  const handleInputChange = useCallback((e) => {
    setQuery(e.target.value);
  }, []);

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

      {error && <p className="error">Ошибка: {error}</p>}

      {loading && query && <p className="loading">Загрузка результатов...</p>}

      {query && results.length === 0 && !loading && (
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

      {!query && (
        <div className="search-hint">
          <p>Начните ввод для поиска аниме...</p>
        </div>
      )}
    </div>
  );
}

export default memo(Search);