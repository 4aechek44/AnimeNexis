import React, { createContext, useState, useCallback, useMemo } from 'react';

export const AnimeContext = createContext();

export function AnimeProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading favorites:', e);
      return [];
    }
  });

  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem('watchlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading watchlist:', e);
      return [];
    }
  });

  const toggleFavorite = useCallback((anime) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.mal_id === anime.mal_id);
      const updated = exists 
        ? prev.filter((fav) => fav.mal_id !== anime.mal_id) 
        : [...prev, anime];
      localStorage.setItem('favorites', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const toggleWatchlist = useCallback((anime) => {
    setWatchlist((prev) => {
      const exists = prev.some((item) => item.mal_id === anime.mal_id);
      const updated = exists 
        ? prev.filter((item) => item.mal_id !== anime.mal_id) 
        : [...prev, anime];
      localStorage.setItem('watchlist', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isFavorite = useCallback((id) => favorites.some((fav) => fav.mal_id === id), [favorites]);
  const isInWatchlist = useCallback((id) => watchlist.some((item) => item.mal_id === id), [watchlist]);

  const value = useMemo(() => ({
    favorites,
    watchlist,
    toggleFavorite,
    toggleWatchlist,
    isFavorite,
    isInWatchlist,
  }), [favorites, watchlist, toggleFavorite, toggleWatchlist, isFavorite, isInWatchlist]);

  return (
    <AnimeContext.Provider value={value}>
      {children}
    </AnimeContext.Provider>
  );
}