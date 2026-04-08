const BASE_URL = 'https://api.jikan.moe/v4';
const CACHE = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 минут
const MAX_CACHE_SIZE = 100; // Максимальный размер кеша

const getCacheKey = (endpoint, params) => `${endpoint}:${JSON.stringify(params)}`;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Простой LRU механизм - удаляет самый старый элемент если кеш переполнен
const manageCacheSize = () => {
  if (CACHE.size > MAX_CACHE_SIZE) {
    const firstKey = CACHE.keys().next().value;
    CACHE.delete(firstKey);
  }
};

const fetchWithCache = async (endpoint, params = {}, options = {}, attempt = 1) => {
  const cacheKey = getCacheKey(endpoint, params);
  const cached = CACHE.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${BASE_URL}${endpoint}?${query}` : `${BASE_URL}${endpoint}`;
    
    // Добавляем небольшую задержку для избежания rate limiting
    if (attempt > 1) {
      await delay(1000 * (attempt - 1));
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, { 
      ...options, 
      signal: controller.signal 
    });
    
    clearTimeout(timeoutId);
    
    if (response.status === 429) {
      // Rate limit - ждем и повторяем
      if (attempt < 3) {
        await delay(2000);
        return fetchWithCache(endpoint, params, options, attempt + 1);
      }
      throw new Error('API перегружена, попробуйте позже');
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    manageCacheSize();
    CACHE.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Превышено время ожидания');
    }
    console.error('Fetch error:', error);
    // Если есть кеш, верните его даже если истек
    if (CACHE.has(cacheKey)) {
      return CACHE.get(cacheKey).data;
    }
    throw error;
  }
};

export const jikan = {
  getTopAnime: (page = 1, type = 'all') => {
    const params = { page, limit: 25 };
    if (type !== 'all') {
      params.type = type;
    }
    return fetchWithCache('/top/anime', params);
  },
  
  getSeasonNow: (page = 1) => 
    fetchWithCache('/seasons/now', { page, limit: 25 }),
  
  getAnimeById: (id) => 
    fetchWithCache(`/anime/${id}`, {}),
  
  getAnimeCharacters: (id) => 
    fetchWithCache(`/anime/${id}/characters`, {}),
  
  getAnimeRecommendations: (id) => 
    fetchWithCache(`/anime/${id}/recommendations`, {}),
  
  getAnimeReviews: (id, page = 1) => 
    fetchWithCache(`/anime/${id}/reviews`, { page, limit: 10 }),
  
  searchAnime: (query, params = {}, options = {}) => {
    const searchParams = { q: query, limit: 25, ...params };
    return fetchWithCache('/anime', searchParams, options);
  },
  
  getAnimeList: (params = {}) => 
    fetchWithCache('/anime', { limit: 25, ...params }),
  
  getGenres: () => 
    fetchWithCache('/genres/anime', {}),
  
  getProducers: () => 
    fetchWithCache('/producers', { limit: 100 }),
  
  getStudios: () => 
    fetchWithCache('/studios', { limit: 100 }),
};