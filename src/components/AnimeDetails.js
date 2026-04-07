import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAnimeById, useAnimeCharacters, useAnimeRecommendations, useAnimeReviews } from '../hooks/useAnime';
import { useAnimeContext } from '../hooks/useAnimeContext';
import './AnimeDetails.css';

function AnimeDetails() {
  const { id } = useParams();
  const { data: anime, loading, error } = useAnimeById(id);
  const { data: charactersData } = useAnimeCharacters(id);
  const { data: recommendationsData } = useAnimeRecommendations(id);
  const { data: reviewsData } = useAnimeReviews(id);
  const { isFavorite, isInWatchlist, toggleFavorite, toggleWatchlist } = useAnimeContext();

  // Мемоизация обработанных данных
  const processedData = useMemo(() => ({
    characters: charactersData?.data || [],
    recommendations: recommendationsData?.data || [],
    reviews: reviewsData?.data || [],
  }), [charactersData, recommendationsData, reviewsData]);

  if (loading) return <div className="loading-page">Загрузка...</div>;
  if (error) return <div className="error-page">Ошибка: {error}</div>;
  if (!anime) return <div className="error-page">Аниме не найдено</div>;

  return (
    <div className="anime-details">
      <div className="details-header">
        <img src={anime.images?.jpg?.image_url} alt={anime.title} className="anime-poster" />
        
        <div className="details-info">
          <h1>{anime.title}</h1>
          {anime.title_english && anime.title_english !== anime.title && (
            <p className="subtitle">{anime.title_english}</p>
          )}
          
          <div className="details-meta">
            <div className="meta-item">
              <span className="label">Рейтинг:</span>
              <span className="value">⭐ {anime.score || 'N/A'} ({anime.scored_by?.toLocaleString() || 0} голосов)</span>
            </div>
            <div className="meta-item">
              <span className="label">Ранк:</span>
              <span className="value">#{anime.rank || 'N/A'}</span>
            </div>
            <div className="meta-item">
              <span className="label">Популярность:</span>
              <span className="value">#{anime.popularity || 'N/A'}</span>
            </div>
            <div className="meta-item">
              <span className="label">Тип:</span>
              <span className="value">{anime.type || 'Unknown'}</span>
            </div>
            <div className="meta-item">
              <span className="label">Эпизодов:</span>
              <span className="value">{anime.episodes || 'TBA'}</span>
            </div>
            <div className="meta-item">
              <span className="label">Статус:</span>
              <span className="value">{anime.status || 'Unknown'}</span>
            </div>
            <div className="meta-item">
              <span className="label">Вышло:</span>
              <span className="value">{anime.aired?.string || 'Unknown'}</span>
            </div>
            <div className="meta-item">
              <span className="label">Жанры:</span>
              <span className="value">{anime.genres?.map(g => g.name).join(', ') || 'N/A'}</span>
            </div>
          </div>

          <div className="details-buttons">
            <button 
              className={`btn btn-favorite ${isFavorite(anime.mal_id) ? 'active' : ''}`}
              onClick={() => toggleFavorite(anime)}
            >
              {isFavorite(anime.mal_id) ? '❤️ В избранном' : '🤍 Добавить в избранное'}
            </button>
            <button 
              className={`btn btn-watchlist ${isInWatchlist(anime.mal_id) ? 'active' : ''}`}
              onClick={() => toggleWatchlist(anime)}
            >
              {isInWatchlist(anime.mal_id) ? '✓ В списке' : '+ Добавить в список'}
            </button>
            {anime.url && (
              <a href={anime.url} target="_blank" rel="noopener noreferrer" className="btn btn-external">
                На MyAnimeList ↗
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="details-content">
        {anime.synopsis && (
          <section className="section">
            <h2>Описание</h2>
            <p className="synopsis">{anime.synopsis}</p>
          </section>
        )}

        {anime.background && (
          <section className="section">
            <h2>История создания</h2>
            <p>{anime.background}</p>
          </section>
        )}

        {anime.members && (
          <section className="section">
            <h2>Статистика</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Всего членов</span>
                <span className="stat-value">{anime.members?.toLocaleString() || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Всего голосов</span>
                <span className="stat-value">{anime.scored_by?.toLocaleString() || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Средний рейтинг</span>
                <span className="stat-value">{anime.score || 'N/A'}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Позиция в топе</span>
                <span className="stat-value">#{anime.rank || 'N/A'}</span>
              </div>
            </div>
          </section>
        )}

        {anime.studios && anime.studios.length > 0 && (
          <section className="section">
            <h2>Студия</h2>
            <div className="studios">
              {anime.studios.map(studio => (
                <span key={studio.mal_id} className="tag">{studio.name}</span>
              ))}
            </div>
          </section>
        )}

        {processedData.characters.length > 0 && (
          <section className="section">
            <h2>Персонажи ({processedData.characters.length})</h2>
            <div className="characters-grid">
              {processedData.characters.slice(0, 6).map(char => (
                <div key={char.character.mal_id} className="character-card">
                  <img src={char.character.images?.jpg?.image_url} alt={char.character.name} />
                  <div className="character-info">
                    <h4>{char.character.name}</h4>
                    <p>{char.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {processedData.recommendations.length > 0 && (
          <section className="section">
            <h2>Рекомендации</h2>
            <div className="recommendations-grid">
              {processedData.recommendations.slice(0, 6).map(rec => (
                <Link 
                  key={rec.entry.mal_id} 
                  to={`/anime/${rec.entry.mal_id}`}
                  className="recommendation-card"
                >
                  <img src={rec.entry.images?.jpg?.image_url} alt={rec.entry.title} />
                  <h4>{rec.entry.title}</h4>
                </Link>
              ))}
            </div>
          </section>
        )}

        {processedData.reviews.length > 0 && (
          <section className="section">
            <h2>Отзывы ({processedData.reviews.length})</h2>
            <div className="reviews">
              {processedData.reviews.slice(0, 3).map(review => (
                <div key={review.mal_id} className="review-item">
                  <div className="review-header">
                    <span className="review-author">{review.user.username}</span>
                    <span className="review-score">⭐ {review.score}/10</span>
                  </div>
                  <p className="review-text">{review.review.substring(0, 200)}...</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default AnimeDetails;