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
      <h1>Каталог аниме</h1>

      <div className="filters">
        <div className="filter-group">
          <label>Тип</label>
          <select value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)}>
            <option value="">Все</option>
            <option value="tv">TV</option>
            <option value="movie">Фильм</option>
            <option value="ova">OVA</option>
            <option value="special">Спешл</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Статус</label>
          <select value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)}>
            <option value="">Все</option>
            <option value="airing">В эфире</option>
            <option value="complete">Завершено</option>
            <option value="upcoming">Предстоящее</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Минимальный рейтинг</label>
          <select value={filters.min_score} onChange={(e) => handleFilterChange('min_score', e.target.value)}>
            <option value="">Все</option>
            <option value="6">6.0+</option>
            <option value="7">7.0+</option>
            <option value="8">8.0+</option>
            <option value="9">9.0+</option>
          </select>
        </div>
      </div>

      {error && <p className="error">Ошибка загрузки: {error}</p>}

      {loading ? (
        <p className="loading">Загрузка аниме...</p>
      ) : anime.length === 0 ? (
        <p className="no-results">Аниме не найдено</p>
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