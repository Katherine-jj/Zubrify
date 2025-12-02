import React from "react";
import "./PoemItem.css";
import timeIcon from "../../assets/images/time.svg";
import img1 from "../../assets/images/1.png";

const API_URL = "http://localhost:8055";

export default function PoemItem({ poem, index, showRank, showTime, onClick }) {

  // Directus может вернуть строку "true", поэтому приводим к boolean
  const isUserUploaded = poem.is_user_uploaded === true || poem.is_user_uploaded === "true";

  // Безопасная логика картинки
  const imgSrc =
    isUserUploaded || !poem.image
      ? img1
      : `${API_URL}/assets/${poem.image}`;

  return (
    <div className="poem-item" onClick={onClick}>
      {showRank && <span className="poem-rank">{index + 1}</span>}

      <img
        src={imgSrc}
        alt={poem.title}
        className="poem-thumb"
      />

      <div className="poem-info">
        <p className="poem-title">{poem.title}</p>
        <p className="poem-author">{poem.author?.name}</p>
      </div>

      {showTime && (
        <div className="poem-extra">
          <img src={timeIcon} alt="" />
          <span>15 мин</span>
        </div>
      )}
    </div>
  );
}
