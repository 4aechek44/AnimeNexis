import { useState, useCallback } from "react";

// Статусы списков
export const LIST_STATUSES = {
  WATCHING: "watching",
  PLANNED: "planned",
  COMPLETED: "completed",
  DROPPED: "dropped",
  FAVORITE: "favorite",
};

const STORAGE_KEY = "anime_user_lists";

function loadLists() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {};
  } catch {
    return {};
  }
}

function saveLists(lists) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
}

export function useUserList() {
  const [lists, setLists] = useState(loadLists);

  const _update = useCallback((updater) => {
    setLists((prev) => {
      const next = updater(prev);
      saveLists(next);
      return next;
    });
  }, []);

  // Добавить / переместить тайтл
  const addToList = useCallback((status, anime) => {
    _update((prev) => {
      // убираем из всех списков (кроме избранного)
      const cleaned = {};
      for (const key of Object.keys(prev)) {
        if (key === LIST_STATUSES.FAVORITE) {
          cleaned[key] = prev[key]; // избранное не трогаем
        } else {
          cleaned[key] = (prev[key] ?? []).filter((a) => a.mal_id !== anime.mal_id);
        }
      }
      return {
        ...cleaned,
        [status]: [...(cleaned[status] ?? []), anime],
      };
    });
  }, [_update]);

  // Удалить из конкретного списка
  const removeFromList = useCallback((status, mal_id) => {
    _update((prev) => ({
      ...prev,
      [status]: (prev[status] ?? []).filter((a) => a.mal_id !== mal_id),
    }));
  }, [_update]);

  // Переключить избранное
  const toggleFavorite = useCallback((anime) => {
    _update((prev) => {
      const favs = prev[LIST_STATUSES.FAVORITE] ?? [];
      const exists = favs.some((a) => a.mal_id === anime.mal_id);
      return {
        ...prev,
        [LIST_STATUSES.FAVORITE]: exists
          ? favs.filter((a) => a.mal_id !== anime.mal_id)
          : [...favs, anime],
      };
    });
  }, [_update]);

  // Получить статус тайтла
  const getStatus = useCallback((mal_id) => {
    for (const [status, items] of Object.entries(lists)) {
      if (status === LIST_STATUSES.FAVORITE) continue;
      if ((items ?? []).some((a) => a.mal_id === mal_id)) return status;
    }
    return null;
  }, [lists]);

  const isFavorite = useCallback((mal_id) =>
    (lists[LIST_STATUSES.FAVORITE] ?? []).some((a) => a.mal_id === mal_id),
  [lists]);

  // Статистика профиля
  const getStats = useCallback(() => {
    const completed = lists[LIST_STATUSES.COMPLETED] ?? [];
    const allRated = completed.filter((a) => a.score);
    const avgScore = allRated.length
      ? (allRated.reduce((s, a) => s + a.score, 0) / allRated.length).toFixed(1)
      : null;

    const genreCount = {};
    for (const anime of completed) {
      for (const g of anime.genres ?? []) {
        genreCount[g.name] = (genreCount[g.name] ?? 0) + 1;
      }
    }
    const topGenres = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name);

    return {
      watchingCount: (lists[LIST_STATUSES.WATCHING] ?? []).length,
      plannedCount: (lists[LIST_STATUSES.PLANNED] ?? []).length,
      completedCount: completed.length,
      droppedCount: (lists[LIST_STATUSES.DROPPED] ?? []).length,
      favoritesCount: (lists[LIST_STATUSES.FAVORITE] ?? []).length,
      avgScore,
      topGenres,
    };
  }, [lists]);

  return {
    lists,
    addToList,
    removeFromList,
    toggleFavorite,
    getStatus,
    isFavorite,
    getStats,
    statuses: LIST_STATUSES,
  };
}