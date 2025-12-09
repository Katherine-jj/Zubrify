import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import SearchBar from "../SearchBar/SearchBar";
import PoemItem from "../PoemItem/PoemItem";

import backIcon from "../../assets/images/backButtonGrey.svg";
import "../PoemListPage/PoemListPage.css";

export default function PoemListPage({
  title,
  poems,
  backTo = "/",
  showTime = true
}) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const filtered = poems.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="poem-list-page">

      <div className="poem-list-header">
        <button className="back-btn" onClick={() => navigate(backTo)}>
          <img src={backIcon} alt="back" />
        </button>
        <h1>{title}</h1>
      </div>

      <SearchBar value={query} onChange={setQuery} />

      <div className="poem-list-wrapper">
        {filtered.map((poem) => (
          <PoemItem
            key={poem.id}
            poem={poem}
            showTime={showTime}
            onClick={() => navigate(`/poem/${poem.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
