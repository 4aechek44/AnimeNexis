import { useContext } from 'react';
import { AnimeContext } from '../context/AnimeContext';

export function useAnimeContext() {
  const context = useContext(AnimeContext);
  if (!context) {
    throw new Error('useAnimeContext must be used within AnimeProvider');
  }
  return context;
}