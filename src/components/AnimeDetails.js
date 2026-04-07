import React from 'react';
import { useParams } from 'react-router-dom';
import { useAnimeById, useAnimeCharacters, useAnimeRecommendations, useAnimeReviews } from '../hooks/useAnime';

function AnimeDetails() {
  const { id } = useParams();
  const { data: anime, loading, error } = useAnimeById(id);
  const { data: characters } = useAnimeCharacters(id);
  const { data: recommendations } = useAnimeRecommendations(id);
  const { data: reviews } = useAnimeReviews(id);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;
  if (!anime) return <p>Аниме не найдено</p>;

  return (
    <div>
      <h1>{anime.title}</h1>
      <img src={anime.images.jpg.image_url} alt={anime.title} />
      <p>{anime.synopsis}</p>
      <h2>Персонажи</h2>
      {/* Отобразить characters */}
      <h2>Рекомендации</h2>
      {/* Отобразить recommendations */}
      <h2>Отзывы</h2>
      {/* Отобразить reviews */}
    </div>
  );
}

export default AnimeDetails;