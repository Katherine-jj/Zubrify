import React from "react";
import "./GradePoemList.css";
import SectionHeader from "../SectionHeader/SectionHeader";
import PoemItem from "../PoemItem/PoemItem";
import { useNavigate } from "react-router-dom";

export default function GradePoemList({ title, poems }) {
  const navigate = useNavigate();

  // Если вдруг массив пустой — подстрахуемся
  const gradeId = poems[0]?.grade?.id;

  return (
    <>
      <SectionHeader 
        title={title} 
        link={`/grade/${gradeId}`}   // ← Открываем страницу полного списка
      />

      <div className="poem-list">
        {poems.map((poem, i) => (
          <PoemItem
            key={poem.id}
            poem={poem}
            index={i}
            showRank
            showTime
            onClick={() => navigate(`/poem/${poem.id}`)}
          />
        ))}
      </div>
    </>
  );
}
