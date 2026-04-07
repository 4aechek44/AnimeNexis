import React, { useState } from 'react';
import AnimeList from './AnimeList';
import { useAnimeCatalog } from '../hooks/useAnime';

function Catalog() {
  const [params, setParams] = useState({});
  const { data, loading, error } = useAnimeCatalog(params);

  // Пример фильтров (расширить по необходимости)
  const handleFilterChange = (key, value) => {
    setParams({ ...params, [key]: value });
  };

  return (
    <div>
      <h1>Каталог аниме</h1>
      <div>
        <select onChange={(e) => handleFilterChange('type', e.target.value)}>
          <option value="">Тип</option>
          <option value="tv">TV</option>
          <option value="movie">Movie</option>
        </select>
        {/* Добавить другие фильтры */}
      </div>
      <AnimeList anime={data?.data} loading={loading} error={error} />
    </div>
  );
}

export default Catalog;