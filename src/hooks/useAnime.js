import { useState, useEffect, useCallback } from "react";
import { jikan } from "../api/jikan";

// Универсальный хук для любого Jikan-запроса
function useJikan(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetcher()
      .then((res) => { if (!cancelled) setData(res); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, deps);

  return { data, loading, error };
}

// Топ / популярные
export function useTopAnime(page = 1) {
  return useJikan(() => jikan.getTopAnime(page), [page]);
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

  const search = useCallback(() => {
    if (!query.trim()) { setResults([]); return; }
    let cancelled = false;
    setLoading(true);
    jikan.searchAnime(query, params)
      .then((res) => { if (!cancelled) setResults(res.data ?? []); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [query]);

  useEffect(() => {
    const timer = setTimeout(search, 400); // debounce 400ms
    return () => clearTimeout(timer);
  }, [search]);

  return { results, loading, error };
}

// Каталог с фильтрами
export function useAnimeCatalog(params = {}) {
  const key = JSON.stringify(params);
  return useJikan(() => jikan.getAnimeList(params), [key]);
}