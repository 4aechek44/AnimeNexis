import React from 'react';
import { Link } from 'react-router-dom';

function AnimeList({ anime, loading, error }) {
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!anime || anime.length === 0) return <p>No data available</p>;

  return (
    <div className="anime-list">
      {anime.map((item) => (
        <div key={item.mal_id} className="anime-item">
          <img src={item.images.jpg.image_url} alt={item.title} />
          <h3><Link to={`/anime/${item.mal_id}`}>{item.title}</Link></h3>
          <p>{item.synopsis?.substring(0, 100)}...</p>
        </div>
      ))}
    </div>
  );
}

export default AnimeList;