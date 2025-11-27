import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

import SearchBar from "../components/SearchBar/SearchBar";
import PoemItem from "../components/PoemItem/PoemItem";

import backIcon from "../assets/images/backButton.svg";
import "../css/Favorites.css";

export default function Favorites() {
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  const [query, setQuery] = useState("");

  const filtered = favorites.filter((fav) =>
    fav.poem.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="favorites-page">

      <div className="favorites-header">
        <button className="back-btn" onClick={() => navigate("/profile")}>
          <img src={backIcon} alt="back" />
        </button>
        <h1>Избранное</h1>
      </div>

      <SearchBar value={query} onChange={setQuery} />

      <div className="favorites-list">
        {filtered.map((fav) => (
          <PoemItem
            key={fav.id}
            poem={fav.poem}
            showTime={true}
            onClick={() => navigate(`/poem/${fav.poem.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
