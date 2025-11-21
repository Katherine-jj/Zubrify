import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/PoemPage.css";

import backIcon from "../assets/images/IconBack.svg";
import favIcon from "../assets/images/fav=off.svg";

const API_URL = "http://localhost:8055";

export default function PoemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poem, setPoem] = useState(null);

  useEffect(() => {
    fetchPoem();
  }, []);

  async function fetchPoem() {
    const res = await fetch(
      `${API_URL}/items/poems/${id}?fields=id,title,text,image,author.name`
    );
    const data = await res.json();
    setPoem(data.data);
  }

  if (!poem) return <div className="loading">Загрузка...</div>;

  return (
    <div className="poem-page">

      {/* Верхние кнопки */}
      <div className="top-buttons">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <img src={backIcon} alt="back" />
        </button>

        <button className="like-btn" onClick={() => alert("Избранное в разработке. ЗАглушка")}>
          <img src={favIcon} alt="fav" />
        </button>
      </div>

      {/* Картинка */}
      <div className="poem-image-wrapper">
        <img
          src={`${API_URL}/assets/${poem.image}`}
          alt={poem.title}
          className="poem-image"
        />
      </div>

      <div className="poem-content">
        <h1 className="poem-title">{poem.title}</h1>
        <p className="poem-author">{poem.author?.name}</p>

        <div className="poem-text">
          {poem.text.split("\n").map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </div>

      {/* --- Фиксированная кнопка "Учить" --- */}
      <button className="learn-btn" onClick={() => navigate(`/learn/${id}`)}>
        <span>Учить</span>
        <span className="arrow">›</span>
      </button>
    </div>
  );
}
