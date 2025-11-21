import React from "react";
import "./SearchBar.css";
import searchIcon from "../../assets/images/Search.svg";
import downloadIcon from "../../assets/images/solar_download-linear.svg";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <div className="search-bar-inner">
        <img src={searchIcon} alt="" className="search-icon" />

        <input
          type="text"
          placeholder="Найти"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="search-input"
        />

        <button className="search-upload-btn">
          <img src={downloadIcon} alt="Загрузить" className="download-icon" />
        </button>
      </div>
    </div>
  );
}
