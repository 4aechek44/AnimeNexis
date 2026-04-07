const BASE_URL = 'https://api.jikan.moe/v4';

export const jikan = {
  getTopAnime: (page = 1) => fetch(`${BASE_URL}/top/anime?page=${page}`).then(res => res.json()),
  getSeasonNow: (page = 1) => fetch(`${BASE_URL}/seasons/now?page=${page}`).then(res => res.json()),
  getAnimeById: (id) => fetch(`${BASE_URL}/anime/${id}`).then(res => res.json()),
  getAnimeCharacters: (id) => fetch(`${BASE_URL}/anime/${id}/characters`).then(res => res.json()),
  getAnimeRecommendations: (id) => fetch(`${BASE_URL}/anime/${id}/recommendations`).then(res => res.json()),
  getAnimeReviews: (id, page = 1) => fetch(`${BASE_URL}/anime/${id}/reviews?page=${page}`).then(res => res.json()),
  searchAnime: (query, params = {}, options = {}) => fetch(`${BASE_URL}/anime?q=${encodeURIComponent(query)}&${new URLSearchParams(params)}`, options).then(res => res.json()),
  getAnimeList: (params = {}) => fetch(`${BASE_URL}/anime?${new URLSearchParams(params)}`).then(res => res.json()),
};