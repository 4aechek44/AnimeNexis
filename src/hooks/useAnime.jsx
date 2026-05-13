import { useState, useEffect, useCallback, useRef } from "react";
import { jikan } from "../api/jikan";

// Универсальный хук для любого Jikan-запроса
function useJikan(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    isMountedRef.current = true;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetcher();
        if (!cancelled && isMountedRef.current) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled && isMountedRef.current) {
          setError(err.message || 'Ошибка загрузки');
        }
      } finally {
        if (!cancelled && isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchData();
    
    return () => { 
      cancelled = true; 
    };
  }, deps);

  return { data, loading, error };
}

// Топ / популярные
export function useTopAnime(page = 1, type = 'all') {
  return useJikan(() => jikan.getTopAnime(page, type), [page, type]);
}

// Сезонные (тренды)
export function useSeasonNow(page = 1) {
  return useJikan(() => jikan.getSeasonNow(page), [page]);
}

// Страница тайтла
export function useAnimeById(id) {
  return useJikan(() => jikan.getAnimeById(id), [id]);
}

// Персонажи тайтла
export function useAnimeCharacters(id) {
  return useJikan(() => jikan.getAnimeCharacters(id), [id]);
}

// Похожие
export function useAnimeRecommendations(id) {
  return useJikan(() => jikan.getAnimeRecommendations(id), [id]);
}

// Отзывы
export function useAnimeReviews(id, page = 1) {
  return useJikan(() => jikan.getAnimeReviews(id, page), [id, page]);
}

// Простой поиск аниме с debounce
export function useAnimeSearch(query) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    // Очищаем таймер когда unmount
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Очищаем старый таймер
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Если пусто - очищаем результаты
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    // Нужно минимум 2 символа
    if (query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    // Ставим debounce 500ms
    debounceRef.current = setTimeout(() => {
      setLoading(true);
      setError(null);

      jikan.searchAnime(query)
        .then((res) => {
          let data = res.data || [];
          
          // Фильтруем хентай (rating Rx)
          data = data.filter(anime => {
            const rating = anime.rating || '';
            return !rating.includes('Rx') && !rating.includes('hentai');
          });
          
          // Сортируем по рейтингу
          const sorted = data.sort((a, b) => (b.score || 0) - (a.score || 0));
          setResults(sorted);
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            setError(err.message || 'Ошибка поиска');
            setResults([]);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }, 500);
  }, [query]);

  return { results, loading, error };
}

// Каталог с фильтрами
export function useAnimeCatalog(params = {}) {
  const key = JSON.stringify(params);
  return useJikan(() => jikan.getAnimeList(params), [key]);
}