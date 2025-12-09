import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/PoemPage.css";

import backIcon from "../assets/images/Forward.svg";
import favIconOff from "../assets/images/fav=off.svg";
import favIconOn from "../assets/images/fav=on.svg";

import { useFavorites } from "../context/FavoritesContext";
import img1 from "../assets/images/1.png";

const API_URL = "http://localhost:8055";

export default function PoemPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [poem, setPoem] = useState(null);

  const { isFavorite, add, remove } = useFavorites();

  useEffect(() => {
    fetchPoem();
  }, []);

  async function fetchPoem() {
    const res = await fetch(
      `${API_URL}/items/poems/${id}?fields=id,title,text,image,author.name,is_user_uploaded`
    );
    const data = await res.json();
    setPoem(data.data);
  }

  function handleFavoriteClick() {
    if (isFavorite(poem.id)) remove(poem.id);
    else add(poem.id);
  }

  if (!poem) return <div className="loading">Загрузка...</div>;

  return (
    <div className="poem-page">
      {/* Верхние кнопки поверх картинки */}
      <div className="top-buttons">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <img src={backIcon} alt="back" />
        </button>

        <button className="like-btn" onClick={handleFavoriteClick}>
          <img
            src={isFavorite(poem.id) ? favIconOn : favIconOff}
            alt="fav"
          />
        </button>
      </div>

      {/* Картинка */}
      <div className="poem-image-wrapper">
        <img
          src={
            poem.is_user_uploaded === true ||
            poem.is_user_uploaded === "true" ||
            !poem.image
              ? img1
              : `${API_URL}/assets/${poem.image}`
          }
          alt={poem.title}
          className="poem-image"
        />
      </div>

      {/* Контент */}
      <div className="poem-content">
        <h1 className="poem-title-learn">{poem.title}</h1>
        <p className="poem-author-learn">{poem.author?.name}</p>

        <div className="poem-text">
          {poem.text.split("\n").map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </div>

      {/* Фиксированная кнопка "Учить" */}
      <button className="learn-btn" onClick={() => navigate(`/learn/${id}`)}>
        <span>Учить</span>
        <span className="arrow">›</span>
      </button>
    </div>
  );
}
