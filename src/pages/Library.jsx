// src/pages/Library.jsx

import React, { useEffect, useState } from "react";
import "../css/Library.css";
import { useNavigate } from "react-router-dom";

import SearchBar from "../components/SearchBar/SearchBar";
import GradePoemList from "../components/GradePoemList/GradePoemList";
import PoemItem from "../components/PoemItem/PoemItem";
import UploadPoemModal from "../components/UploadPoemModal";

import { getPoems, getCurrentUser, getGrades } from "../directusApi";
import { createUserPoem } from "../directusApi";

export default function Library() {
  const [user, setUser] = useState(null);
  const [poems, setPoems] = useState([]);
  const [grades, setGrades] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");

  const [showUpload, setShowUpload] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const me = await getCurrentUser();
      if (!me) {
        navigate("/login");
        return;
      }
      setUser(me);

      const allGrades = await getGrades();
      setGrades(allGrades);

      const allPoems = await getPoems();
      setPoems(allPoems);

      setSelectedGrade(String(me.grade?.id));
    }
    load();
  }, []);

  if (!user || !grades.length) return <p>Загрузка...</p>;

// Стихи для выбранного класса
  const filtered = poems.filter(p => {
    const title = (p.title || "").toLowerCase();

    // Нормализуем автора (строка)
    const author =
      (typeof p.author === "string"
        ? p.author
        : p.author?.name || ""
      ).toLowerCase();

    const matchTitle = title.includes(search.toLowerCase());
    const matchAuthor = author.includes(search.toLowerCase());
    const matchSearch = matchTitle || matchAuthor;

    const matchGrade =
      selectedGrade === "" || String(p.grade?.id) === selectedGrade;

    return matchSearch && matchGrade;
  });

  // Стихи "Учат в твоём классе"
  const gradePoems = poems.filter(p => p.grade?.id === user.grade?.id);

  return (
    <div className="library-container">
      <h1 className="library-title">Библиотека</h1>

      <SearchBar
        value={search}
        onChange={setSearch}
        onUploadClick={() => setShowUpload(true)}
      />

      <GradePoemList
        title={`Учат в <span class="highlight">${user.grade?.num}</span> классе`}
        poems={gradePoems}
      />

      {/* Табы классов */}
      <div className="class-tabs">
        {grades.map(g => (
          <button
            key={g.id}
            className={String(selectedGrade) === String(g.id) ? "active" : ""}
            onClick={() => setSelectedGrade(String(g.id))}
          >
            {g.num} класс
          </button>
        ))}
      </div>


      {/* Список стихов */}
      <div className="poem-list">
        {filtered.map(poem => (
          <PoemItem
            key={poem.id}
            poem={poem}
            onClick={() => navigate(`/poem/${poem.id}`)}
          />
        ))}
      </div>

      {showUpload && (
        <UploadPoemModal
          onClose={() => setShowUpload(false)}
          childId={user.id}
          childGrade={user.grade}
          onUploaded={async (poem) => {
            await createUserPoem(poem);
            setShowUpload(false); // можно закрывать и здесь
          }}
        />


      )}
    </div>
  );
}
