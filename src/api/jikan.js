const BASE_URL = "https://api.jikan.moe/v4";

async function request(endpoint, params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `${BASE_URL}${endpoint}${query ? `?${query}` : ""}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Jikan error: ${res.status}`);
  return res.json();
}

// Аниме
export const jikan = {
  // Топ аниме (популярные)
  getTopAnime: (page = 1, filter = "bypopularity") =>
    request("/top/anime", { page, filter }),

  // Аниме в тренде (сезон)
  getSeasonNow: (page = 1) =>
    request("/seasons/now", { page }),

  // Поиск
  searchAnime: (q, params = {}) =>
    request("/anime", { q, ...params }),

  // Карточка тайтла
  getAnimeById: (id) =>
    request(`/anime/${id}`),

  // Персонажи тайтла
  getAnimeCharacters: (id) =>
    request(`/anime/${id}/characters`),

  // Страница персонажа
  getCharacterById: (id) =>
    request(`/characters/${id}`),

  // Похожие аниме
  getAnimeRecommendations: (id) =>
    request(`/anime/${id}/recommendations`),

  // Отзывы
  getAnimeReviews: (id, page = 1) =>
    request(`/anime/${id}/reviews`, { page }),

  // Каталог с фильтрами
  getAnimeList: (params = {}) =>
    request("/anime", params),
};