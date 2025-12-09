// src/pages/GradePoemListFull.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPoemsByGrade, getGradeById } from "../directusApi";
import PoemListPage from "../components/PoemListPage/PoemListPage";

export default function GradePoemsPage() {
  const { gradeId } = useParams();

  const [poems, setPoems] = useState([]);
  const [gradeNum, setGradeNum] = useState(null);

  useEffect(() => {
    if (!gradeId) return;
    load();
  }, [gradeId]);

  async function load() {
    const grade = await getGradeById(gradeId);
    setGradeNum(grade?.num || "?");

    const list = await getPoemsByGrade(gradeId);
    setPoems(list || []);
  }

  return (
    <PoemListPage
      title={
        <>
          Учат в{" "}
          <span style={{ color: "#FF9F69" }}>
            {gradeNum}
          </span>{" "}
          классе
        </>
      }
      poems={poems}
      backTo="/library"
    />
  );
}
