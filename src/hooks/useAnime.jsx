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

// Поиск с debounce
export function useAnimeSearch(query, params = {}) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const search = useCallback(() => {
    if (!query.trim()) { 
      setResults([]); 
      setLoading(false);
      setError(null);
      return; 
    }

    // Отменяем предыдущий запрос
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    jikan.searchAnime(query, params, { signal: abortControllerRef.current.signal })
      .then((res) => { 
        if (isMountedRef.current) {
          setResults(res.data ?? []);
        }
      })
      .catch((err) => { 
        if (isMountedRef.current && err.name !== 'AbortError') {
          setError(err.message || 'Ошибка поиска');
        }
      })
      .finally(() => { 
        if (isMountedRef.current) {
          setLoading(false);
        }
      });
  }, [query, params]);

  useEffect(() => {
    // Очищаем предыдущий таймер
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(search, 500); // Увеличил debounce до 500ms

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, search]);

  return { results, loading, error };
}

// Каталог с фильтрами
export function useAnimeCatalog(params = {}) {
  const key = JSON.stringify(params);
  return useJikan(() => jikan.getAnimeList(params), [key]);
}