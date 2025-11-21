import React, { useEffect, useState } from "react";
import "../css/Library.css";
import { useNavigate } from "react-router-dom";

import SearchBar from "../components/SearchBar/SearchBar";
import GradePoemList from "../components/GradePoemList/GradePoemList";
import PoemItem from "../components/PoemItem/PoemItem";

const API_URL = "http://localhost:8055";

export default function Library() {
  const [poems, setPoems] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("4");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/items/poems?fields=id,title,author.name,image,grade.num`)
      .then(res => res.json())
      .then(data => setPoems(data.data || []));
  }, []);

  const fixedPoems = poems.filter(p => p.grade?.num === 3);

  const filtered = poems.filter(p => {
    return (
      p.title.toLowerCase().includes(search.toLowerCase()) &&
      String(p.grade?.num) === selectedGrade
    );
  });

  return (
    <div className="library-container">
      <h1 className="library-title">Библиотека</h1>

      <SearchBar value={search} onChange={setSearch} />

      <GradePoemList
        title='Учат в <span class="highlight">3</span> классе'
        poems={fixedPoems}
      />

      <div className="class-tabs">
        {["1","2","3","4","5","6","7","8","9","10","11"].map((grade) => (
          <button
            key={grade}
            className={selectedGrade === grade ? "active" : ""}
            onClick={() => setSelectedGrade(grade)}
          >
            {grade} класс
          </button>
        ))}
      </div>

      <div className="poem-list">
        {filtered.map((poem) => (
          <PoemItem
            key={poem.id}
            poem={poem}
            onClick={() => navigate(`/poem/${poem.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
