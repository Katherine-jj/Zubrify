import React from "react";
import { useFavorites } from "../context/FavoritesContext";
import PoemListPage from "../components/PoemListPage/PoemListPage";

export default function Favorites() {
  const { favorites } = useFavorites();

  const poems = favorites.map(f => f.poem);

  return (
    <PoemListPage
      title="Избранное"
      poems={poems}
      backTo="/profile"
      showTime={true}
    />
  );
}
