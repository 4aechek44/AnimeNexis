const BASE_URL = 'https://api.jikan.moe/v4';
const CACHE = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 минут

const getCacheKey = (endpoint, params) => `${endpoint}:${JSON.stringify(params)}`;

const fetchWithCache = async (endpoint, params = {}, options = {}) => {
  const cacheKey = getCacheKey(endpoint, params);
  const cached = CACHE.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${BASE_URL}${endpoint}?${query}` : `${BASE_URL}${endpoint}`;
    const response = await fetch(url, options);
    
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    
    const data = await response.json();
    CACHE.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export const jikan = {
  getTopAnime: (page = 1, type = 'all') => 
    fetchWithCache('/top/anime', { page, type }),
  
  getSeasonNow: (page = 1) => 
    fetchWithCache('/seasons/now', { page, limit: 25 }),
  
  getAnimeById: (id) => 
    fetchWithCache(`/anime/${id}`, { fields: 'mal_id,url,images,trailer,title,title_english,title_japanese,type,source,episodes,status,airing,aired,premiered,season,studios,genres,demographics,themes,duration,rating,score,scored_by,rank,popularity,members,synopsis,background,season' }),
  
  getAnimeCharacters: (id) => 
    fetchWithCache(`/anime/${id}/characters`, {}, { signal: undefined }),
  
  getAnimeRecommendations: (id) => 
    fetchWithCache(`/anime/${id}/recommendations`, {}),
  
  getAnimeReviews: (id, page = 1) => 
    fetchWithCache(`/anime/${id}/reviews`, { page, limit: 10 }),
  
  getAnimeStats: (id) => 
    fetchWithCache(`/anime/${id}/statistics`, {}),
  
  getAnimeForum: (id) => 
    fetchWithCache(`/anime/${id}/forum`, {}),
  
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
  
  getAnimeSchedule: (day) => 
    fetchWithCache('/schedules', { filter: day }),
};