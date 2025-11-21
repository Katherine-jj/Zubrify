import React from "react";
import "./BigPoemCard.css";
import timeIcon from "../../assets/images/time.svg";

const API_URL = "http://localhost:8055";

export default function BigPoemCard({ poem, onClick }) {
  return (
    <div className="big-card" onClick={onClick}>
      <img
        src={`${API_URL}/assets/${poem.image}`}
        alt={poem.title}
        className="big-card-img"
      />
      <p className="big-card-title">{poem.title}</p>
      <p className="big-card-author">{poem.author.name}</p>

      <div className="big-card-extra">
        <img src={timeIcon} alt="" />
        <span>5 мин</span>
      </div>
    </div>
  );
}
