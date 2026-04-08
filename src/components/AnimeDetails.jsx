import React, { useMemo, memo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAnimeById, useAnimeCharacters, useAnimeRecommendations, useAnimeReviews } from '../hooks/useAnime';
import { useAnimeContext } from '../hooks/useAnimeContext';
import './AnimeDetails.css';

function AnimeDetails() {
  const { id } = useParams();
  const { data: apiData, loading, error } = useAnimeById(id);
  const { data: charactersData } = useAnimeCharacters(id);
  const { data: recommendationsData } = useAnimeRecommendations(id);
  const { data: reviewsData } = useAnimeReviews(id);
  const { isFavorite, isInWatchlist, toggleFavorite, toggleWatchlist } = useAnimeContext();

  // Извлекаем значение anime из apiData (API возвращает { data: {...}, pagination: {...} })
  const anime = apiData?.data || apiData;

  const processedData = useMemo(() => ({
    characters: charactersData?.data?.data || charactersData?.data || [],
    recommendations: recommendationsData?.data?.data || recommendationsData?.data || [],
    reviews: reviewsData?.data?.data || reviewsData?.data || [],
  }), [charactersData, recommendationsData, reviewsData]);

  if (loading) return <div className="loading-page">⌛ Загрузка информации об аниме...</div>;
  if (error) return <div className="error-page">❌ Ошибка: {error}</div>;
  if (!anime) return <div className="error-page">🔍 Аниме не найдено</div>;

  const scorePercentage = (anime.score / 10) * 100;

  return (
    <div className="anime-details">
      {/* Hero Background */}
      <div className="hero-background" style={{
        backgroundImage: `linear-gradient(135deg, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8)), url(${anime.images?.jpg?.large_image_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }} />

      {/* Header Section */}
      <div className="details-header">
        <div className="poster-container">
          <img 
            src={anime.images?.jpg?.image_url || 'https://via.placeholder.com/300x400?text=No+Image'} 
            alt={anime.title} 
            className="anime-poster" 
            loading="lazy"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/300x400?text=No+Image'; }}
          />
          <div className="poster-badge">
            <span className="badge-score">⭐ {anime.score || 'N/A'}</span>
          </div>
        </div>
        
        <div className="details-info">
          <h1 className="anime-title">{anime.title}</h1>
          {anime.title_english && anime.title_english !== anime.title && (
            <p className="subtitle">{anime.title_english}</p>
          )}
          {anime.title_japanese && (
            <p className="japanese-title">{anime.title_japanese}</p>
          )}
          
          {/* Quick Stats */}
          <div className="quick-stats">
            <div className="stat-row">
              <span className="rating-label">Рейтинг:</span>
              <div className="rating-bar">
                <div className="rating-fill" style={{ width: `${scorePercentage}%` }}></div>
              </div>
              <span className="rating-text">{anime.score}/10 ({anime.scored_by?.toLocaleString()})</span>
            </div>
          </div>

          {/* Main Meta */}
          <div className="details-meta">
            <div className="meta-item">
              <span className="label">Тип: </span>
              <span className="value">{anime.type || 'Unknown'}</span>
            </div>
            <div className="meta-item">
              <span className="label">Эпизодов: </span>
              <span className="value">{anime.episodes || 'TBA'}</span>
            </div>
            <div className="meta-item">
              <span className="label">Статус: </span>
              <span className={`value status-${anime.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                {anime.status || 'Unknown'}
              </span>
            </div>
            <div className="meta-item">
              <span className="label">Эфир: </span>
              <span className="value">{anime.aired?.string || 'Unknown'}</span>
            </div>
            <div className="meta-item">
              <span className="label">Рейтинг MAL: </span>
              <span className="value">#{anime.rank || 'N/A'}</span>
            </div>
            <div className="meta-item">
              <span className="label">Популярность: </span>
              <span className="value">#{anime.popularity || 'N/A'}</span>
            </div>
            {anime.rating && (
              <div className="meta-item">
                <span className="label">Возраст: </span>
                <span className="value">{anime.rating}</span>
              </div>
            )}
            {anime.source && (
              <div className="meta-item">
                <span className="label">Источник: </span>
                <span className="value">{anime.source}</span>
              </div>
            )}
          </div>

          {/* Genres and Themes */}
          {anime.genres && anime.genres.length > 0 && (
            <div className="genres-section">
              <h3>Жанры</h3>
              <div className="genres-grid">
                {anime.genres.map(g => (
                  <span key={g.mal_id} className="genre-tag">{g.name}</span>
                ))}
              </div>
            </div>
          )}

          {anime.themes && anime.themes.length > 0 && (
            <div className="themes-section">
              <h3>Темы</h3>
              <div className="themes-grid">
                {anime.themes.map(t => (
                  <span key={t.mal_id} className="theme-tag">{t.name}</span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="details-buttons">
            <button 
              className={`btn btn-favorite ${isFavorite(anime.mal_id) ? 'active' : ''}`}
              onClick={() => toggleFavorite(anime)}
              title={isFavorite(anime.mal_id) ? 'Убрать из избранного' : 'Добавить в избранное'}
            >
              {isFavorite(anime.mal_id) ? '❤️ В избранном' : '🤍 Избранное'}
            </button>
            <button 
              className={`btn btn-watchlist ${isInWatchlist(anime.mal_id) ? 'active' : ''}`}
              onClick={() => toggleWatchlist(anime)}
              title={isInWatchlist(anime.mal_id) ? 'Убрать из списка' : 'Добавить в список'}
            >
              {isInWatchlist(anime.mal_id) ? '✓ В списке' : '📝 К просмотру'}
            </button>
            {anime.url && (
              <a href={anime.url} target="_blank" rel="noopener noreferrer" className="btn btn-external" title="Открыть на MyAnimeList">
                На MyAnimeList ↗
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="details-content">
        {/* Synopsis */}
        {anime.synopsis && (
          <section className="section">
            <h2>📖 Описание</h2>
            <p className="synopsis">{anime.synopsis}</p>
          </section>
        )}

        {/* Background */}
        {anime.background && (
          <section className="section">
            <h2>🎬 История создания</h2>
            <p className="background-text">{anime.background}</p>
          </section>
        )}

        {/* Production Info */}
        {(anime.studios?.length > 0 || anime.producers?.length > 0) && (
          <section className="section">
            <h2>🏢 Производство</h2>
            <div className="production-grid">
              {anime.studios && anime.studios.length > 0 && (
                <div className="production-item">
                  <h3>Студии</h3>
                  <div className="production-list">
                    {anime.studios.map(studio => (
                      <span key={studio.mal_id} className="production-tag">{studio.name}</span>
                    ))}
                  </div>
                </div>
              )}
              {anime.producers && anime.producers.length > 0 && (
                <div className="production-item">
                  <h3>Продюсеры</h3>
                  <div className="production-list">
                    {anime.producers.slice(0, 5).map(producer => (
                      <span key={producer.mal_id} className="production-tag">{producer.name}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Statistics */}
        {anime.members && (
          <section className="section">
            <h2>📊 Статистика</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-label">Членов сообщества</div>
                <div className="stat-value">{anime.members?.toLocaleString()}</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-label">Голосов</div>
                <div className="stat-value">{anime.scored_by?.toLocaleString()}</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🏆</div>
                <div className="stat-label">Позиция в топе</div>
                <div className="stat-value">#{anime.rank || 'N/A'}</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🔥</div>
                <div className="stat-label">Популярность</div>
                <div className="stat-value">#{anime.popularity || 'N/A'}</div>
              </div>
            </div>
          </section>
        )}

        {/* Characters */}
        {processedData.characters.length > 0 && (
          <section className="section">
            <h2>👤 Персонажи ({processedData.characters.length})</h2>
            <div className="characters-grid">
              {processedData.characters.slice(0, 12).map(char => (
                <div key={char.character.mal_id} className="character-card">
                  <div className="character-image">
                    <img 
                      src={char.character.images?.jpg?.image_url || 'https://via.placeholder.com/140x150?text=No+Image'} 
                      alt={char.character.name}
                      loading="lazy"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/140x150?text=No+Image'; }}
                    />
                  </div>
                  <div className="character-info">
                    <h4 className="character-name">{char.character.name}</h4>
                    <p className="character-role">{char.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recommendations */}
        {processedData.recommendations.length > 0 && (
          <section className="section">
            <h2>🎯 Рекомендации</h2>
            <div className="recommendations-grid">
              {processedData.recommendations.slice(0, 8).map(rec => (
                <Link 
                  key={rec.entry.mal_id} 
                  to={`/anime/${rec.entry.mal_id}`}
                  className="recommendation-card"
                  title={rec.entry.title}
                >
                  <div className="recommendation-image">
                    <img 
                      src={rec.entry.images?.jpg?.image_url || 'https://via.placeholder.com/140x180?text=No+Image'} 
                      alt={rec.entry.title}
                      loading="lazy"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/140x180?text=No+Image'; }}
                    />
                  </div>
                  <h4 className="recommendation-title">{rec.entry.title}</h4>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Reviews */}
        {processedData.reviews.length > 0 && (
          <section className="section">
            <h2>💬 Отзывы</h2>
            <div className="reviews">
              {processedData.reviews.slice(0, 5).map(review => (
                <div key={review.mal_id} className="review-item">
                  <div className="review-header">
                    <div className="review-author-info">
                      <span className="review-author">{review.user.username}</span>
                      <span className="review-date">{new Date(review.date).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <div className="review-rating">
                      <span className="score">⭐ {review.score}/10</span>
                      <span className="helpful">👍 {review.helpful_count}</span>
                    </div>
                  </div>
                  <p className="review-text">{review.review.substring(0, 300)}...</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default memo(AnimeDetails);