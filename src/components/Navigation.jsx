import React, { useState, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAnimeContext } from '../hooks/useAnimeContext';
import './Navigation.css';

function Navigation() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { favorites, watchlist } = useAnimeContext();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          NEXIS
        </Link>

        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Найти аниме..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">🔍</button>
        </form>

        <div className="navbar-menu">
          <Link to="/" className="nav-link">Главная</Link>
          <Link to="/catalog" className="nav-link">Каталог</Link>
          <Link to="/favorites" className="nav-link">
            Избранное ({favorites.length})
          </Link>
          <Link to="/watchlist" className="nav-link">
            К просмотру ({watchlist.length})
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default memo(Navigation);