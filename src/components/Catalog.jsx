import React, { useState, memo, useCallback } from 'react';
import AnimeCard from './AnimeCard';
import { useAnimeCatalog } from '../hooks/useAnime';
import './Catalog.css';

function Catalog() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    min_score: '',
  });
  const { data, loading, error } = useAnimeCatalog({ ...filters, page, limit: 25 });

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  }, []);

  const handleNextPage = useCallback(() => {
    setPage(page + 1);
    window.scrollTo(0, 0);
  }, [page]);

  const handlePrevPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo(0, 0);
    }
  }, [page]);

  const anime = data?.data || [];
  const pagination = data?.pagination || {};

  return (
    <div className="catalog">
      <h1>Catalog</h1>

      <div className="filters">
        <div className="filter-group">
          <label>Type</label>
          <select value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)}>
            <option value="">All</option>
            <option value="tv">TV</option>
            <option value="movie">Movie</option>
            <option value="ova">OVA</option>
            <option value="special">Special</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Status</label>
          <select value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)}>
            <option value="">All</option>
            <option value="airing">Airing</option>
            <option value="complete">Complete</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Minimum Rating</label>
          <select value={filters.min_score} onChange={(e) => handleFilterChange('min_score', e.target.value)}>
            <option value="">All</option>
            <option value="6">6.0+</option>
            <option value="7">7.0+</option>
            <option value="8">8.0+</option>
            <option value="9">9.0+</option>
          </select>
        </div>
      </div>

      {error && <p className="error">Error loading anime: {error}</p>}

      {loading ? (
        <p className="loading">Loading anime...</p>
      ) : anime.length === 0 ? (
        <p className="no-results">No anime found</p>
      ) : (
        <>
          <div className="anime-grid">
            {anime.map((item) => (
              <AnimeCard key={item.mal_id} anime={item} />
            ))}
          </div>

          {pagination.last_page && pagination.last_page > 1 && (
            <div className="pagination">
              <button onClick={handlePrevPage} disabled={page === 1}>
                ← Назад
              </button>
              <span className="page-info">
                {page} / {pagination.last_page}
              </span>
              <button onClick={handleNextPage} disabled={page >= pagination.last_page}>
                Вперед →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default memo(Catalog);