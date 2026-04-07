import React, { createContext, useState, useCallback } from 'react';

export const AnimeContext = createContext();

export function AnimeProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('watchlist');
    return saved ? JSON.parse(saved) : [];
  });

  const saveFavorites = useCallback((newFavorites) => {
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  }, []);

  const saveWatchlist = useCallback((newWatchlist) => {
    setWatchlist(newWatchlist);
    localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
  }, []);

  const toggleFavorite = useCallback((anime) => {
    setFavorites((prev) => {
      const exists = prev.find((fav) => fav.mal_id === anime.mal_id);
      const updated = exists ? prev.filter((fav) => fav.mal_id !== anime.mal_id) : [...prev, anime];
      localStorage.setItem('favorites', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const toggleWatchlist = useCallback((anime) => {
    setWatchlist((prev) => {
      const exists = prev.find((item) => item.mal_id === anime.mal_id);
      const updated = exists ? prev.filter((item) => item.mal_id !== anime.mal_id) : [...prev, anime];
      localStorage.setItem('watchlist', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isFavorite = useCallback((id) => favorites.some((fav) => fav.mal_id === id), [favorites]);
  const isInWatchlist = useCallback((id) => watchlist.some((item) => item.mal_id === id), [watchlist]);

  return (
    <AnimeContext.Provider value={{ favorites, watchlist, toggleFavorite, toggleWatchlist, isFavorite, isInWatchlist }}>
      {children}
    </AnimeContext.Provider>
  );
}