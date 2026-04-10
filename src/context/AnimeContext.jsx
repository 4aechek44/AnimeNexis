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

  const [plans, setPlans] = useState(() => {
    try {
      const saved = localStorage.getItem('plans');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading plans:', e);
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

  const togglePlans = useCallback((anime) => {
    setPlans((prev) => {
      const exists = prev.some((item) => item.mal_id === anime.mal_id);
      const updated = exists 
        ? prev.filter((item) => item.mal_id !== anime.mal_id) 
        : [...prev, anime];
      localStorage.setItem('plans', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isFavorite = useCallback((id) => favorites.some((fav) => fav.mal_id === id), [favorites]);
  const isInWatchlist = useCallback((id) => watchlist.some((item) => item.mal_id === id), [watchlist]);
  const isInPlans = useCallback((id) => plans.some((item) => item.mal_id === id), [plans]);

  const value = useMemo(() => ({
    favorites,
    watchlist,
    plans,
    toggleFavorite,
    toggleWatchlist,
    togglePlans,
    isFavorite,
    isInWatchlist,
    isInPlans,
  }), [favorites, watchlist, plans, toggleFavorite, toggleWatchlist, togglePlans, isFavorite, isInWatchlist, isInPlans]);

  return (
    <AnimeContext.Provider value={value}>
      {children}
    </AnimeContext.Provider>
  );
}