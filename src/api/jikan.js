const BASE_URL = 'https://api.jikan.moe/v4';
const CACHE = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 минут

const getCacheKey = (endpoint, params) => `${endpoint}:${JSON.stringify(params)}`;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

    const response = await fetch(url, { ...options, timeout: 10000 });
    
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
    CACHE.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    // Если есть кеш, верните его даже если истек
    if (CACHE.has(cacheKey)) {
      return CACHE.get(cacheKey).data;
    }
    throw error;
  }
};

export const jikan = {
  getTopAnime: (page = 1, type = 'all') => 
    fetchWithCache('/top/anime', { page, type }),
  
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