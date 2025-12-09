// src/pages/Home.jsx

import React, { useEffect, useState } from "react";
import "../css/Home.css";
import { useNavigate } from "react-router-dom";

import SearchBar from "../components/SearchBar/SearchBar";
import SectionHeader from "../components/SectionHeader/SectionHeader";
import PoemSlider from "../components/PoemSlider/PoemSlider";
import GradePoemList from "../components/GradePoemList/GradePoemList";
import UploadPoemModal from "../components/UploadPoemModal";

import { getCurrentUser, getPoems, getUploadedPoems } from "../directusApi";

import img1 from "../assets/images/1.png";
const API_URL = "http://localhost:8055";

export default function Home() {
  const [user, setUser] = useState(null);
  const [poems, setPoems] = useState([]);
  const [uploaded, setUploaded] = useState([]);
  const [search, setSearch] = useState("");    
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

      const allPoems = await getPoems();
      setPoems(allPoems);

      // Загруженные пользователем стихи
      const myUploaded = await getUploadedPoems(me.id);
      setUploaded(myUploaded || []);
    }

    load();
  }, []);

  if (!user) return <p>Загрузка...</p>;

  const userGradeId = user.grade?.id;

  const gradePoems = poems.filter(p => p.grade?.id === userGradeId);
  const gradePoemsTop3 = gradePoems.slice(0, 3);   // ← берём только 3

  // пока просто рандомные примеры
  const studyPoems = poems.slice(0, 5);
  const likedPoems = poems.slice(5, 12);

  return (
    <div className="home-container">
      <h1 className="home-title">Что будешь учить сегодня?</h1>

      <SearchBar 
        value={search}
        onChange={setSearch}
        onUploadClick={() => setShowUpload(true)}
        showUploadButton={true}
      />
      {showUpload && (
        <UploadPoemModal
          onClose={() => setShowUpload(false)}
          childId={user.id}
          childGrade={user.grade}
          onUploaded={async () => {}}
        />
      )}

      {/* ---- Стихи на изучении ---- */}
      <SectionHeader title="Стихи на изучении" link="/library" />
      <PoemSlider
        poems={studyPoems}
        onSelect={id => navigate(`/poem/${id}`)}
      />

      {/* ---- Стихи по классу ---- */}
      <GradePoemList
        title={`Учат в <span class="highlight">${user.grade?.num}</span> классе`}
        poems={gradePoemsTop3}
      />

      {/* ---- Загруженные пользователем ---- */}
      <div className="child-block-title" style={{ marginTop: "24px" }}>
        Загруженные стихи
      </div>

      <div className="child-uploaded">
        {uploaded.length === 0 ? (
          <div className="child-empty">Пока пусто</div>
        ) : (
          uploaded.map((p) => (
            <div
              className="child-history-item"
              key={p.id}
              onClick={() => navigate(`/poem/${p.id}`)}
            >
              <img
                src={p.is_user_uploaded ? img1 : `${API_URL}/assets/${p.image}`}
                className="child-history-img"
              />

              <div className="child-history-info">
                <div className="child-history-title">{p.title}</div>
                <div className="child-history-author">
                  {p.author?.name || ""}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ---- Рекомендации ---- */}
      <SectionHeader title="Может понравиться" link="/library" />
      <PoemSlider
        poems={likedPoems}
        onSelect={id => navigate(`/poem/${id}`)}
      />


    </div>
  );
}
