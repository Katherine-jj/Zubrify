import "../css/ChildProfile.css";
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";   // ← добавили useNavigate
import { getPoems, getChild } from '../directusApi';
import img1 from '../assets/images/1.png';

// ICONS
import arrowAcc from "../assets/images/iconProfile/arrow_acc.svg";
import exitIcon from "../assets/images/iconProfile/exit.svg";
import favHeart from "../assets/images/iconProfile/fav_heart.svg";
import progressIcon from "../assets/images/iconProfile/progress.svg";
import settingsIcon from "../assets/images/iconProfile/settings.svg";
import supportIcon from "../assets/images/iconProfile/support.svg";

export default function ChildProfile() {

  const navigate = useNavigate();        // ← Инициализация навигации
  const { id } = useParams();
  const [child, setChild] = useState(null);
  const [poems, setPoems] = useState([]);

  useEffect(() => {
    async function load() {
      const childData = await getChild(id);
      const poemsData = await getPoems();
      setChild(childData);
      setPoems(poemsData);
    }
    load();
  }, [id]);


  // --- ВЫХОД ИЗ ДЕТСКОГО АККАУНТА ---
  function handleExit() {
    // Удаляем данные о выбранном ребёнке
    localStorage.removeItem("childId");

    // Переходим на страницу профиля родителя
    navigate("/parent-profile");
  }


  if (!child) return <p>Загрузка...</p>;

  return (
    <div className="child-wrapper">

      {/* HEADER */}
      <div className="child-header">
        <div className="child-user-info">
          <img src={child.avatar || img1} className="child-avatar" />
          <div>
            <div className="child-role">Ученик</div>
            <div className="child-class">{child.grade} класс</div>
          </div>
        </div>
        <button className="child-bell">*</button>
      </div>

      {/* CARDS */}
      <div className="child-cards">
        <div className="child-card blue">
          <div className="child-card-number">0</div>
          <div className="child-card-text">Выучено</div>
          <img src={arrowAcc} className="child-card-arrow" />
        </div>
        <div className="child-card orange">
          <div className="child-card-number">0</div>
          <div className="child-card-text">В планах</div>
          <img src={arrowAcc} className="child-card-arrow" />
        </div>
      </div>

      {/* MENU */}
      <div className="child-menu">
        <div className="child-menu-item">
          <img src={favHeart} /> Избранное
        </div>
        <div className="child-menu-item">
          <img src={settingsIcon} /> Настройка
        </div>
        <div className="child-menu-item">
          <img src={supportIcon} /> Поддержка
        </div>
      </div>

      {/* PROGRESS */}
      <div className="child-block-title">Прогресс стихов</div>
      <div className="child-progress">
        {["Май", "Июнь", "Июль"].map((m, i) => (
          <div key={i} className="child-progress-item">
            <img src={progressIcon} className="child-progress-bg" />
            <div className="child-progress-value">0</div>
            <div className="child-progress-month">{m}</div>
          </div>
        ))}
      </div>

      {/* HISTORY */}
      <div className="child-block-title">История изучения</div>
      <div className="child-history">
        {poems.map(p => (
          <div className="child-history-item" key={p.id}>
            <img src={p.image || img1} className="child-history-img" />
            <div className="child-history-info">
              <div className="child-history-title">{p.title}</div>
              <div className="child-history-author">{p.author}</div>
            </div>
            <div className="child-history-time">15 мин</div>
          </div>
        ))}
      </div>

      {/* EMPTY UPLOADED */}
      <div className="child-block-title">Загруженные стихотворения</div>
      <div className="child-empty">Пока пусто</div>

      <div className="child-exit">
        <img src={exitIcon} /> Выход
      </div>

    </div>
  );
}
