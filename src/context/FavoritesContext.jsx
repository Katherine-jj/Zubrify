
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getFavoritesByUser,
  addToFavorites,
  removeFromFavorites,
  getFavoriteRecord,
} from "../directusApi";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [favorites, setFavorites] = useState([]);   // [{id, poem:{...}}]

  // Загружаем избранное при старте приложения
  useEffect(() => {
    if (user) loadFavorites();
  }, [user]);

  async function loadFavorites() {
    if (!user) return;
    const list = await getFavoritesByUser(user.id);
    setFavorites(list || []);
  }

  // Проверяем — есть ли стих в избранном
  function isFavorite(poemId) {
    return favorites.some((fav) => fav.poem.id === poemId);
  }

  function getFavoriteId(poemId) {
    const record = favorites.find((fav) => fav.poem.id === poemId);
    return record ? record.id : null;
  }

  // Добавить в избранное
  async function add(poemId) {
    const newFav = await addToFavorites(user.id, poemId);
    setFavorites((prev) => [...prev, newFav]);
  }

  // Удалить из избранного
  async function remove(poemId) {
    const favId = getFavoriteId(poemId);
    if (!favId) return;

    await removeFromFavorites(favId);
    setFavorites((prev) => prev.filter((f) => f.id !== favId));
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        getFavoriteId,
        add,
        remove,
        loadFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

// Хук для удобства
export function useFavorites() {
  return useContext(FavoritesContext);
}
