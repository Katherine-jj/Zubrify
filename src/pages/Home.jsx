// src/pages/Home.jsx

import React, { useEffect, useState } from "react";
import "../css/Home.css";
import { useNavigate } from "react-router-dom";

import SearchBar from "../components/SearchBar/SearchBar";
import SectionHeader from "../components/SectionHeader/SectionHeader";
import PoemSlider from "../components/PoemSlider/PoemSlider";
import GradePoemList from "../components/GradePoemList/GradePoemList";

import { getCurrentUser, getPoems } from "../directusApi";

export default function Home() {
  const [user, setUser] = useState(null);
  const [poems, setPoems] = useState([]);

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
    }

    load();
  }, []);

  if (!user) return <p>Загрузка...</p>;

  const userGradeId = user.grade?.id;
  const userGradeNum =
    user.grade?.num ??   // если grade = объект
    user.grade ??        // если grade = число
    null;

  // Стихи для класса ученика
  const gradePoems = poems.filter(p => p.grade?.id === userGradeId);


  // Пока просто рандомные выборки
  const studyPoems = poems.slice(0, 5);
  const likedPoems = poems.slice(5, 12);

  return (
    <div className="home-container">
      <h1 className="home-title">Что будешь учить сегодня?</h1>

      <SearchBar />

      <SectionHeader title="Стихи на изучении" link="/library" />
      <PoemSlider
        poems={studyPoems}
        onSelect={id => navigate(`/poem/${id}`)}
      />

      <GradePoemList
        title={`Учат в <span class="highlight">${user.grade?.num}  </span> классе`}
        poems={gradePoems}
      />


      <SectionHeader title="Может понравиться" link="/library" />
      <PoemSlider
        poems={likedPoems}
        onSelect={id => navigate(`/poem/${id}`)}
      />
    </div>
  );
}
