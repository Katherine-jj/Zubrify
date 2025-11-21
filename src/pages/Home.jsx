import React, { useEffect, useState } from "react";
import "../css/Home.css";
import { useNavigate } from "react-router-dom";

import SearchBar from "../components/SearchBar/SearchBar";
import SectionHeader from "../components/SectionHeader/SectionHeader";
import PoemSlider from "../components/PoemSlider/PoemSlider";
import GradePoemList from "../components/GradePoemList/GradePoemList";

const API_URL = "http://localhost:8055";

export default function Home() {
  const [poems, setPoems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/items/poems?fields=id,title,author.name,image,grade.num`)
      .then(res => res.json())
      .then(data => setPoems(data.data || []));
  }, []);

  const studyPoems = poems.slice(0, 5);
  const likedPoems = poems.slice(5, 12);
  const fixedPoems = poems.filter(p => p.grade?.num === 4);

  return (
    <div className="home-container">
      <h1 className="home-title">Что будешь учить сегодня?</h1>

      <SearchBar />

      <SectionHeader title="Стихи на изучении" link="/library" />
      <PoemSlider poems={studyPoems} onSelect={(id) => navigate(`/poem/${id}`)} />

      <GradePoemList
        title='Учат в <span class="highlight">4</span> классе'
        poems={fixedPoems}
      />

      <SectionHeader title="Может понравиться" link="/library" />
      <PoemSlider poems={likedPoems} onSelect={(id) => navigate(`/poem/${id}`)} />
    </div>
  );
}
