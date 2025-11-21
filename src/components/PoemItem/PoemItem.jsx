import React from "react";
import "./PoemItem.css";
import timeIcon from "../../assets/images/time.svg";

const API_URL = "http://localhost:8055";

export default function PoemItem({ poem, index, showRank, showTime, onClick }) {
  return (
    <div className="poem-item" onClick={onClick}>
      {showRank && <span className="poem-rank">{index + 1}</span>}

      <img
        src={`${API_URL}/assets/${poem.image}`}
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
